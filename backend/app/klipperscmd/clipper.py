# flake8: noqa: E501
# clipper/clipper.py

import os
import click
from clippercmd.settings import Settings
from clippercmd.convert_srt_to_txt import convert_srt_to_txt_command
from clippercmd.split import split_command
from clippercmd.extract_audio import extract_audio_command
from clippercmd.transcribe import transcribe_command
from clippercmd.transcribe_word_level import transcribe_word_level_command
from clippercmd.transcribe_word_level_ass import transcribe_word_level_ass_command
from clippercmd.embed_subtitles import embed_subtitles_command
from clippercmd.important_segments import important_segments_command
from clippercmd.extract_video_segments import extract_video_segments_command
from clippercmd.timestamp_to_seconds import timestamp_to_seconds
from clippercmd.run import run_all_steps
from clippercmd.crop_and_stack import crop_and_stack_command
from clippercmd.update_video_status_in_db import update_video_status_in_db_command

@click.group()
@click.pass_context
def cli(ctx):
    """
    A command-line tool to split, transcribe, and subtitle videos.
    It uses a .env file in the same directory to load the OPENAI_API_KEY.
    """
    ctx.obj = Settings()
    if not ctx.obj.OPENAI_API_KEY:
        raise click.UsageError(
            "API key not found. Make sure you have a .env file with "
            "OPENAI_API_KEY defined, or that the environment variable is set."
        )

cli.add_command(convert_srt_to_txt_command)
cli.add_command(split_command)
cli.add_command(extract_audio_command)
cli.add_command(transcribe_command)
cli.add_command(transcribe_word_level_command)
cli.add_command(transcribe_word_level_ass_command)
cli.add_command(embed_subtitles_command)
cli.add_command(important_segments_command)
cli.add_command(extract_video_segments_command)
cli.add_command(timestamp_to_seconds)
cli.add_command(run_all_steps)
cli.add_command(crop_and_stack_command)
cli.add_command(update_video_status_in_db_command)

if __name__ == '__main__':
    cli()
