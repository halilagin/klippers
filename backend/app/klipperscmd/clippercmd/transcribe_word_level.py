import click
import os
import openai
import json
from .utils import _split_audio_for_transcription


def _format_timestamp_for_srt(seconds):
    """Converts seconds to SRT timestamp format (HH:MM:SS,mmm)."""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    milliseconds = int((seconds % 1) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{milliseconds:03d}"


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
        click.secho(f"An error occurred with the OpenAI API: {e}", fg="red")
        raise click.Abort()


def _generate_word_level_srt(transcript_data, output_srt_file, words_per_subtitle=4, time_offset=0):
    """Generates SRT file with word-level timing, grouping 3-5 words per subtitle."""
    if not hasattr(transcript_data, 'words') or not transcript_data.words:
        click.secho("No word-level timing data available", fg="yellow")
        return 0
    
    words = transcript_data.words
    srt_content = []
    subtitle_index = 1
    
    # Group words into subtitles of 3-5 words each
    i = 0
    while i < len(words):
        # Determine how many words to include in this subtitle (3-5)
        remaining_words = len(words) - i
        if remaining_words <= 2:
            # If only 1-2 words left, include them all
            words_in_subtitle = remaining_words
        elif remaining_words == 6:
            # If exactly 6 words left, split into 3+3
            words_in_subtitle = 3
        else:
            # Default to 4 words, but vary between 3-5 for natural breaks
            words_in_subtitle = min(words_per_subtitle, remaining_words)
        
        # Get the words for this subtitle
        subtitle_words = words[i:i + words_in_subtitle]
        
        # Calculate timing
        start_time = subtitle_words[0].start + time_offset
        end_time = subtitle_words[-1].end + time_offset
        
        # Create subtitle text
        subtitle_text = " ".join([word.word for word in subtitle_words])
        
        # Format for SRT
        start_timestamp = _format_timestamp_for_srt(start_time)
        end_timestamp = _format_timestamp_for_srt(end_time)
        
        srt_entry = f"{subtitle_index}\n{start_timestamp} --> {end_timestamp}\n{subtitle_text}\n"
        srt_content.append(srt_entry)
        
        subtitle_index += 1
        i += words_in_subtitle
    
    # Write to file
    with open(output_srt_file, "w", encoding="utf-8") as f:
        f.write("\n".join(srt_content))
    
    click.secho(f"Generated word-level SRT with {subtitle_index - 1} subtitles: {output_srt_file}", fg="green")
    return max(word.end for word in words) if words else 0


def _combine_word_level_srt_files(srt_files, output_path):
    """Combines multiple word-level SRT files into one."""
    click.echo(f"Combining {len(srt_files)} word-level SRT files into {output_path}...")
    
    combined_content = []
    subtitle_index = 1
    
    for srt_file in srt_files:
        with open(srt_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
        
        if not content:
            continue
            
        # Split into individual subtitle blocks
        subtitle_blocks = content.split('\n\n')
        
        for block in subtitle_blocks:
            lines = block.strip().split('\n')
            if len(lines) >= 3:
                # Replace the subtitle index with our sequential one
                lines[0] = str(subtitle_index)
                combined_content.append('\n'.join(lines))
                subtitle_index += 1
    
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write('\n\n'.join(combined_content))
    
    click.secho(f"Successfully combined word-level SRT files into {output_path}", fg="green")


def _transcribe_audio_file_word_level(audio_file, output_srt_file, settings, words_per_subtitle=4):
    """Transcribes an audio file and generates word-level SRT file using OpenAI API."""
    client = openai.OpenAI(api_key=settings.openai_api_key)

    output_dir = os.path.dirname(output_srt_file)
    if not output_dir:
        output_dir = "."
    temp_dir = os.path.join(output_dir, "temp_transcribe_word_level")
    os.makedirs(temp_dir, exist_ok=True)

    # Step 1: Split audio if it's too large
    audio_chunks = _split_audio_for_transcription(audio_file, temp_dir)
    srt_files = []
    cumulative_time_offset = 0

    # Step 2: Transcribe each chunk with word-level timing
    for i, chunk_file in enumerate(audio_chunks):
        click.echo(f"Processing chunk {i+1}/{len(audio_chunks)} for word-level transcription...")
        srt_file = os.path.join(temp_dir, f"chunk_{i}_words.srt")
        
        try:
            # Get word-level transcript data
            transcript_data = _transcribe_chunk_with_word_timing(chunk_file, client)
            
            # Generate SRT with word-level timing
            chunk_duration = _generate_word_level_srt(
                transcript_data, 
                srt_file, 
                words_per_subtitle, 
                cumulative_time_offset
            )
            
            srt_files.append(srt_file)
            
            # Update time offset for next chunk
            if chunk_duration > 0:
                cumulative_time_offset += chunk_duration
                
        except click.Abort:
            click.secho(
                f"Word-level transcription failed for chunk {chunk_file}. Aborting.",
                fg="red"
            )
            # Clean up temp files before exiting
            for f in audio_chunks + srt_files:
                if os.path.exists(f) and temp_dir in f:
                    os.remove(f)
            os.rmdir(temp_dir)
            raise

    # Step 3: Combine SRT files
    if len(srt_files) > 1:
        _combine_word_level_srt_files(srt_files, output_srt_file)
        click.secho("All chunks transcribed and combined with word-level timing.", fg="green")
    else:
        # If there was only one chunk, just move the SRT file
        if srt_files:
            os.rename(srt_files[0], output_srt_file)
            click.secho(
                f"Word-level transcription complete. SRT file saved as {output_srt_file}",
                fg="green"
            )

    # Step 4: Cleanup temporary files
    click.echo("Cleaning up temporary chunk files...")
    for f in audio_chunks + srt_files:
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


@click.command('transcribe-word-level')
@click.option(
    '--audio-file',
    required=True,
    type=click.Path(exists=True, dir_okay=False),
    help="Input audio file."
)
@click.option(
    '--output-srt-file',
    required=True,
    type=click.Path(),
    help="Output SRT subtitle file with word-level timing."
)
@click.option(
    '--words-per-subtitle',
    default=4,
    type=click.IntRange(1, 5),
    help="Number of words per subtitle (3-5, default: 4)."
)
@click.pass_context
def transcribe_word_level_command(ctx, audio_file, output_srt_file, words_per_subtitle):
    """
    Transcribes an audio file and generates an SRT file with word-level timing using OpenAI API.
    Each subtitle contains 3-5 words with precise timing for visual highlighting.
    """
    settings = ctx.obj
    _transcribe_audio_file_word_level(audio_file, output_srt_file, settings, words_per_subtitle) 