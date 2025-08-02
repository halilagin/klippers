import click
import os
import openai
import json
from .utils import _split_audio_for_transcription


def _format_timestamp_for_ass(seconds):
    """Converts seconds to ASS timestamp format (H:MM:SS.cc)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = seconds % 60
    
    return f"{hours}:{minutes:02d}:{secs:05.2f}"


def _transcribe_chunk_with_word_timing(audio_file, client):
    """Transcribes audio chunk and returns word-level timing data."""
    click.echo(f"Transcribing {audio_file} with word-level timing...")
    try:
        with open(audio_file, "rb") as af:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=af,
                response_format="verbose_json",
                timestamp_granularities=["word"]
            )
        return transcript
    except openai.APIError as e:
        click.secho(f"OpenAI API error: {e}", fg="red")
        raise click.Abort()


def _generate_ass_header():
    """Generates the ASS file header with styles for word highlighting."""
    return """[Script Info]
Title: Word-Level Highlighted Subtitles
ScriptType: v4.00+

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFF,&Hffffff,&H000000,&H80000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""


def _generate_word_level_ass(transcript_data, output_ass_file, words_per_subtitle=4, time_offset=0):
    """Generates ASS file with word-level karaoke timing."""
    if not hasattr(transcript_data, 'words') or not transcript_data.words:
        click.secho("No word-level timing data available", fg="yellow")
        return 0
    
    words = transcript_data.words
    ass_content = [_generate_ass_header()]
    
    # Group words into subtitles
    i = 0
    while i < len(words):
        # Determine how many words to include in this subtitle
        remaining_words = len(words) - i
        if remaining_words <= 2:
            words_in_subtitle = remaining_words
        elif remaining_words == 6:
            words_in_subtitle = 3
        else:
            words_in_subtitle = min(words_per_subtitle, remaining_words)
        
        # Get the words for this subtitle
        subtitle_words = words[i:i + words_in_subtitle]
        
        # Calculate timing
        start_time = subtitle_words[0].start + time_offset
        end_time = subtitle_words[-1].end + time_offset
        
        # Create ASS karaoke line
        start_timestamp = _format_timestamp_for_ass(start_time)
        end_timestamp = _format_timestamp_for_ass(end_time)
        
        # Build karaoke text with \k tags for word highlighting
        # Each \k duration specifies how long that word is highlighted (in centiseconds)
        karaoke_text = ""
        
        for j, word in enumerate(subtitle_words):
            word_start = word.start + time_offset
            word_end = word.end + time_offset
            
            # Calculate the actual duration this word should be highlighted
            word_duration_cs = int((word_end - word_start) * 100)
            
            if j == 0:
                # First word: check if there's a delay from subtitle start
                delay_from_start = word_start - start_time
                if delay_from_start > 0.01:  # If more than 10ms delay
                    # Add empty karaoke timing for the silence before first word
                    delay_cs = int(delay_from_start * 100)
                    karaoke_text += f"{{\\k{delay_cs}}}"
                
                # Add the first word with its duration
                karaoke_text += f"{{\\k{word_duration_cs}}}{word.word}"
            else:
                # For subsequent words: check gap from previous word
                prev_word_end = subtitle_words[j-1].end + time_offset
                gap_duration = word_start - prev_word_end
                
                if gap_duration > 0.01:  # If more than 10ms gap
                    # Add space with gap timing
                    gap_cs = int(gap_duration * 100)
                    karaoke_text += f" {{\\k{gap_cs}}}"
                    # Then add word with its duration (no space needed as it's in previous tag)
                    karaoke_text += f"{{\\k{word_duration_cs}}}{word.word}"
                else:
                    # No significant gap, just add space and word
                    karaoke_text += f" {{\\k{word_duration_cs}}}{word.word}"
        
        # Create ASS dialogue line
        ass_line = f"Dialogue: 0,{start_timestamp},{end_timestamp},Default,,0,0,0,,{karaoke_text}"
        ass_content.append(ass_line)
        
        i += words_in_subtitle
    
    # Write to file
    with open(output_ass_file, "w", encoding="utf-8") as f:
        f.write("\n".join(ass_content))
    
    click.secho(f"Generated word-level ASS with karaoke highlighting: {output_ass_file}", fg="green")
    return max(word.end for word in words) if words else 0


def _combine_word_level_ass_files(ass_files, output_path):
    """Combines multiple word-level ASS files into one."""
    if not ass_files:
        click.secho("No ASS files to combine", fg="yellow")
        return
    
    if len(ass_files) == 1:
        # If only one file, just rename it
        os.rename(ass_files[0], output_path)
        return
    
    combined_content = []
    header_added = False
    
    for ass_file in ass_files:
        with open(ass_file, "r", encoding="utf-8") as f:
            content = f.read()
            
        if not header_added:
            # Add the full content of the first file (including header)
            combined_content.append(content)
            header_added = True
        else:
            # For subsequent files, only add the dialogue lines
            lines = content.split('\n')
            dialogue_started = False
            for line in lines:
                if line.startswith('Dialogue:'):
                    dialogue_started = True
                if dialogue_started:
                    combined_content.append(line)
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write('\n'.join(combined_content))


def _transcribe_audio_file_word_level_ass(audio_file, output_ass_file, settings, words_per_subtitle=4):
    """Transcribes an audio file and generates word-level ASS file with karaoke highlighting."""
    client = openai.OpenAI(api_key=settings.openai_api_key)

    output_dir = os.path.dirname(output_ass_file)
    if not output_dir:
        output_dir = "."
    temp_dir = os.path.join(output_dir, "temp_transcribe_word_level_ass")
    os.makedirs(temp_dir, exist_ok=True)

    # Step 1: Split audio if it's too large
    audio_chunks = _split_audio_for_transcription(audio_file, temp_dir)
    ass_files = []
    cumulative_time_offset = 0

    # Step 2: Transcribe each chunk with word-level timing
    for i, chunk_file in enumerate(audio_chunks):
        click.echo(f"Processing chunk {i+1}/{len(audio_chunks)} for word-level ASS transcription...")
        ass_file = os.path.join(temp_dir, f"chunk_{i}_words.ass")
        
        try:
            # Get word-level transcript data
            transcript_data = _transcribe_chunk_with_word_timing(chunk_file, client)
            
            # Generate ASS with word-level karaoke timing
            chunk_duration = _generate_word_level_ass(
                transcript_data, 
                ass_file, 
                words_per_subtitle, 
                cumulative_time_offset
            )
            
            ass_files.append(ass_file)
            
            # Update time offset for next chunk
            if chunk_duration > 0:
                cumulative_time_offset += chunk_duration
                
        except click.Abort:
            click.secho(
                f"Word-level ASS transcription failed for chunk {chunk_file}. Aborting.",
                fg="red"
            )
            # Clean up temp files before exiting
            for f in audio_chunks + ass_files:
                if os.path.exists(f) and temp_dir in f:
                    os.remove(f)
            os.rmdir(temp_dir)
            raise

    # Step 3: Combine ASS files
    if len(ass_files) > 1:
        _combine_word_level_ass_files(ass_files, output_ass_file)
        click.secho("All chunks transcribed and combined into ASS format.", fg="green")
    else:
        # If there was only one chunk, just move the ASS file
        os.rename(ass_files[0], output_ass_file)
        click.secho(
            f"Word-level ASS transcription complete: {output_ass_file}",
            fg="green"
        )

    # Step 4: Cleanup temporary files
    click.echo("Cleaning up temporary chunk files...")
    for f in audio_chunks + ass_files:
        if os.path.exists(f) and temp_dir in f:
            try:
                os.remove(f)
            except OSError as e:
                click.secho(
                    f"Could not remove temp file {f}: {e}", fg="yellow"
                )
    try:
        os.rmdir(temp_dir)
    except OSError as e:
        click.secho(
            f"Could not remove temp directory {temp_dir}: {e}", fg="yellow"
        )


@click.command('transcribe-word-level-ass')
@click.option(
    '--audio-file',
    required=True,
    type=click.Path(exists=True, dir_okay=False),
    help="Input audio file."
)
@click.option(
    '--output-ass-file',
    required=True,
    type=click.Path(),
    help="Output ASS subtitle file with word-level karaoke highlighting."
)
@click.option(
    '--words-per-subtitle',
    default=4,
    type=click.IntRange(1, 5),
    help="Number of words per subtitle (1-5, default: 4)."
)
@click.pass_context
def transcribe_word_level_ass_command(ctx, audio_file, output_ass_file, words_per_subtitle):
    """
    Transcribes an audio file and generates an ASS file with word-level karaoke highlighting.
    Each word is highlighted as it's spoken using ASS karaoke tags.
    """
    settings = ctx.obj
    _transcribe_audio_file_word_level_ass(audio_file, output_ass_file, settings, words_per_subtitle) 