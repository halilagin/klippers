import click
import os
from .utils import _run_ffmpeg


def _validate_files(video_file, srt_file):
    """Validate that input files exist and are readable."""
    if not os.path.exists(video_file):
        raise click.ClickException(f"Video file does not exist: {video_file}")
    
    if not os.path.exists(srt_file):
        raise click.ClickException(f"SRT file does not exist: {srt_file}")
    
    # Check if SRT file has content
    try:
        with open(srt_file, 'r', encoding='utf-8') as f:
            content = f.read().strip()
            if not content:
                raise click.ClickException(f"SRT file is empty: {srt_file}")
            print(f"Debug: SRT file has {len(content)} characters")
            # Show first few lines for debugging
            lines = content.split('\n')[:6]
            print(f"Debug: First few lines of SRT file:")
            for i, line in enumerate(lines):
                print(f"  {i+1}: {repr(line)}")
    except Exception as e:
        raise click.ClickException(f"Cannot read SRT file {srt_file}: {e}")


def _get_video_dimensions(video_file):
    """Get video dimensions using OpenCV."""
    try:
        import cv2  # Lazy import to avoid hard dependency when not needed
    except Exception as import_error:
        raise click.ClickException(
            "OpenCV is required for determining video dimensions. "
            "Please ensure OpenCV is installed and system libs are present (e.g., libGL).\n"
            "On Debian/Ubuntu images: apt-get install -y libgl1 libglib2.0-0 libsm6 libxext6 libxrender1"
        ) from import_error

    cap = cv2.VideoCapture(video_file)
    if not cap.isOpened():
        raise ValueError(f"Could not open video file: {video_file}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()

    return width, height


def _embed_subtitles(video_file, srt_file, output_file, preset, crf, position_middle=False):
    """Embeds (hardcodes) subtitles into a video."""
    # Validate input files first
    # _validate_files(video_file, srt_file)
    
    # Detect subtitle format by file extension
    subtitle_ext = os.path.splitext(srt_file)[1].lower()
    is_ass_format = subtitle_ext == '.ass'
    
    if is_ass_format:
        if position_middle:
            # For ASS files with middle positioning, we have a few options:
            # Option 1: Use subtitles filter (may reduce karaoke but allows positioning)
            # Option 2: Use ass filter with video filtering to modify positioning
            
            # Get video dimensions for optimal font sizing
            width, height = _get_video_dimensions(video_file)
            font_size = max(18, int(height * 0.03))  # 3% of height for better visibility
            
            # Try using subtitles filter with optimized settings for ASS files
            # This preserves some ASS features while allowing positioning override
            subtitle_filter = f"subtitles='{srt_file}':force_style='Alignment=10,FontSize={font_size}'"
            
            print(f"Debug: ASS file with middle positioning")
            print(f"Debug: Video dimensions: {width}x{height}, Font size: {font_size}")
            print(f"Debug: Using subtitles filter with ASS-optimized force_style")
            print(f"Debug: Note: Some karaoke effects may be limited due to positioning override")
        else:
            # For ASS files without positioning override, use pure ass filter
            # This preserves all ASS features including full karaoke highlighting
            subtitle_filter = f"ass='{srt_file}'"
            print(f"Debug: Using pure ASS filter - full karaoke highlighting preserved")
    else:
        # Handle SRT files with positioning options
        if position_middle:
            # Get video dimensions to calculate middle position
            width, height = _get_video_dimensions(video_file)
            # Font size optimized for Instagram/TikTok 16:9 - readable but not overwhelming
            font_size = max(18, int(height * 0.025))  # 2.5% of height for social media
            
            # Use simple approach first - test basic subtitles with middle positioning
            # User confirmed Alignment=10 works for middle positioning
            subtitle_filter = f"subtitles='{srt_file}':force_style='Alignment=10,FontSize={font_size},PrimaryColour=&Hffffff,OutlineColour=&H000000,Outline=2'"
            
            print(f"Debug: Video dimensions: {width}x{height}")
            print(f"Debug: Font size: {font_size} (2.5% of height for social media)")
            print(f"Debug: Using Alignment=10 with outline for visibility")
        else:
            # Standard subtitle positioning (bottom of video)
            subtitle_filter = f"subtitles='{srt_file}'"
    
    cmd = [
        'ffmpeg', '-i', video_file, '-y', '-vf', subtitle_filter,
        '-c:v', 'libx264', '-preset', preset, '-crf', str(crf),
        '-c:a', 'copy'
    ]
    
    # Add additional parameters for better ASS rendering
    if is_ass_format and not position_middle:
        # For pure ASS files, add parameters that improve ASS rendering
        cmd.extend(['-vsync', '1', '-r', '30'])  # Consistent frame rate for smooth karaoke
    
    cmd.append(output_file)
    
    print(f"Debug: Subtitle filter: {subtitle_filter}")
    print(f"Debug: Full FFmpeg command: {' '.join(cmd)}")
    
    _run_ffmpeg(
        cmd, f"Embedding subtitles from {srt_file} into {video_file}"
    )


@click.command('embed-subtitles')
@click.option(
    '--video-file',
    required=True,
    type=click.Path(exists=True, dir_okay=False),
    help="Input video segment."
)
@click.option(
    '--srt-file',
    required=True,
    type=click.Path(exists=True, dir_okay=False),
    help="SRT or ASS subtitle file."
)
@click.option(
    '--output-file',
    required=True,
    type=click.Path(),
    help="Output video file with hardcoded subtitles."
)
@click.option(
    '--preset',
    default='medium',
    show_default=True,
    help="ffmpeg preset for encoding."
)
@click.option(
    '--crf',
    default=23,
    show_default=True,
    help="ffmpeg CRF value for quality (lower is better)."
)
@click.option(
    '--position-middle',
    is_flag=True,
    default=False,
    help="Position subtitles in the middle of the video (for stacked videos)."
)
@click.option(
    '--test-basic',
    is_flag=True,
    default=False,
    help="Test with basic subtitles (no positioning) for debugging."
)
def embed_subtitles_command(video_file, srt_file, output_file, preset, crf, position_middle, test_basic):
    """Embeds (hardcodes) subtitles from an SRT or ASS file into a video. ASS files support word-level highlighting."""
    if test_basic:
        print("Debug: Running in basic test mode (no positioning)")
        _embed_subtitles(video_file, srt_file, output_file, preset, crf, position_middle=False)
    else:
        _embed_subtitles(video_file, srt_file, output_file, preset, crf, position_middle) 