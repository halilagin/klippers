import click
from .utils import _run_ffmpeg


def _extract_audio(video_file, audio_file):
    """Extracts audio from a video file to MP3 format."""
    cmd = [
        'ffmpeg', '-i', video_file, '-y', '-vn',
        '-acodec', 'libmp3lame', '-q:a', '2', audio_file
    ]
    _run_ffmpeg(
        cmd, f"Extracting audio from {video_file} to {audio_file}"
    )


@click.command('extract-audio')
@click.option(
    '--video-file',
    required=True,
    type=click.Path(exists=True, dir_okay=False),
    help="Input video file."
)
@click.option(
    '--audio-file',
    required=True,
    type=click.Path(),
    help="Output audio file (MP3)."
)
def extract_audio_command(video_file, audio_file):
    """Extracts audio from a video file into an MP3."""
    _extract_audio(video_file, audio_file)
