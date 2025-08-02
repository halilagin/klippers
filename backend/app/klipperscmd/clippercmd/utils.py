# flake8: noqa: E501
# clipper/clippercmd/utils.py

import os
import re
import subprocess
import click
import openai
from pydub import AudioSegment
import json


def _run_ffmpeg(cmd, description):
    """Runs an ffmpeg command and reports status."""
    click.echo(f"{description}...")
    try:
        subprocess.run(cmd, check=True, capture_output=True, text=True)
        click.secho("Success!", fg="green")
    except subprocess.CalledProcessError as e:
        click.secho(f"Error during: {description}.", fg="red")
        click.secho(f"ffmpeg stdout: {e.stdout}", fg="yellow")
        click.secho(f"ffmpeg stderr: {e.stderr}", fg="red")
        raise click.Abort()


def _combine_srt_files(srt_files, output_path):
    """Combines multiple SRT files into one, adjusting timestamps."""
    click.echo(f"Combining {len(srt_files)} SRT files into {output_path}...")
    combined_srt_content = ""
    time_offset_ms = 0
    subtitle_index = 1

    for i, srt_file in enumerate(srt_files):
        with open(srt_file, 'r', encoding='utf-8') as f:
            content = f.read()

        # Find the last timestamp in the current SRT file to calculate the
        # offset for the next one.
        last_timestamp_match = re.findall(r'\d{2}:\d{2}:\d{2},\d{3}', content)
        if not last_timestamp_match:
            continue

        max_time_ms = 0
        for ts in last_timestamp_match:
            h, m, s, ms = map(int, re.split('[:,]', ts))
            total_ms = ((h * 3600) + (m * 60) + s) * 1000 + ms
            if total_ms > max_time_ms:
                max_time_ms = total_ms

        def adjust_timestamp(match):
            h, m, s, ms = map(int, re.split('[:,]', match.group(0)))
            total_ms = ((h * 3600) + (m * 60) + s) * 1000 + ms
            new_total_ms = total_ms + time_offset_ms

            new_h, rem = divmod(new_total_ms, 3600000)
            new_m, rem = divmod(rem, 60000)
            new_s, new_ms = divmod(rem, 1000)

            return f"{new_h:02d}:{new_m:02d}:{new_s:02d},{new_ms:03d}"

        # Adjust timestamps for the current file
        adjusted_content = re.sub(
            r'\d{2}:\d{2}:\d{2},\d{3}', adjust_timestamp, content
        )

        # Adjust subtitle indices
        def adjust_index(match):
            nonlocal subtitle_index
            new_index = subtitle_index
            subtitle_index += 1
            return str(new_index)

        # We only adjust index for the numbered lines
        adjusted_content = re.sub(
            r'^\d+\s*$', adjust_index, adjusted_content, flags=re.MULTILINE
        )

        combined_srt_content += adjusted_content.strip() + "\n\n"

        # Update the offset for the next file.
        # Use the original max time from this file.
        time_offset_ms += max_time_ms

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(combined_srt_content.strip())

    click.secho(
        f"Successfully combined SRT files into {output_path}", fg="green"
    )


def _split_audio_for_transcription(
    audio_file, temp_dir, chunk_size_mb=20
):
    """Splits an audio file into chunks smaller than the target size."""
    click.echo(f"Splitting {audio_file} into chunks...")
    audio = AudioSegment.from_file(audio_file)
    chunk_size_bytes = chunk_size_mb * 1024 * 1024
    duration_ms = len(audio)
    file_size_bytes = os.path.getsize(audio_file)

    # Estimate chunk duration based on file size
    if file_size_bytes > chunk_size_bytes:
        num_chunks = int(file_size_bytes / chunk_size_bytes) + 1
        chunk_duration_ms = duration_ms // num_chunks
    else:
        # If file is smaller than chunk size, no need to split
        chunk_files = [audio_file]
        click.echo(
            "Audio file is smaller than chunk size, no splitting needed."
        )
        return chunk_files

    chunk_files = []
    for i in range(num_chunks):
        start_ms = i * chunk_duration_ms
        end_ms = (i + 1) * chunk_duration_ms
        if end_ms > duration_ms:
            end_ms = duration_ms

        chunk = audio[start_ms:end_ms]
        chunk_file_path = os.path.join(temp_dir, f"chunk_{i}.mp3")
        chunk.export(chunk_file_path, format="mp3")
        chunk_files.append(chunk_file_path)
        click.echo(
            f"Exported chunk {i+1}/{num_chunks}: {chunk_file_path}"
        )

    return chunk_files

def _get_video_duration(video_path):
    """Gets the duration of a video in seconds using ffprobe."""
    cmd = [
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', video_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())


def _transcribe_and_generate_srt(audio_file, output_srt_file,  client):
    """Transcribes audio and generates an SRT file using OpenAI API."""
    click.echo(f"Transcribing {audio_file} with OpenAI Whisper API...")
    try:
        with open(audio_file, "rb") as af:
            transcript = client.audio.transcriptions.create(
                model="whisper-1",
                file=af,
                response_format="srt"
            )
        # The 'transcript' variable is already a string in SRT format.
        with open(output_srt_file, "w", encoding="utf-8") as f:
            f.write(transcript)
        click.secho(f"Generated SRT: {output_srt_file}", fg="green")
    except openai.APIError as e:
        click.secho(f"An error occurred with the OpenAI API: {e}", fg="red")
        raise click.Abort() 

def _calculate_dynamic_padding(w, h, target_aspect_ratio=9.0/16.0, overall_padding_factor=1.5):
    """
    Calculates padding for a face to fit a target aspect ratio.
    """
    face_aspect_ratio = 1.0 * w / h if h > 0 else 0

    if face_aspect_ratio > target_aspect_ratio:
        # Face is wider than target, so we calculate new height based on width
        new_w = w
        new_h = new_w / target_aspect_ratio
    else:
        # Face is taller or equal to target, calculate new width based on height
        new_h = h
        new_w = new_h * target_aspect_ratio

    # Apply overall padding
    padded_w = new_w * overall_padding_factor
    padded_h = new_h * overall_padding_factor
    
    # Calculate padding needed on each side
    pad_x = (padded_w - w) / 2
    pad_y = (padded_h - h) / 2
    
    return int(pad_x), int(pad_y) 