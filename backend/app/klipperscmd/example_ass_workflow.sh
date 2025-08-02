#!/bin/bash

# Example workflow for ASS word-level highlighting
# This demonstrates how to create karaoke-style subtitles where each word is highlighted as it's spoken

# Default values
INPUT_VIDEO=${1:-"podcast01.mp4"}
SEGMENT_COUNT=${2:-10}

# Check if input video exists
if [[ ! -f "$INPUT_VIDEO" ]]; then
    echo "Error: Input video file '$INPUT_VIDEO' does not exist"
    exit 1
fi

# Generate output directory
TIMESTAMP=$(date +%Y%m%d%H%M%S)
ROOT_DIR="podcast-output-ass-${TIMESTAMP}"
mkdir -p "$ROOT_DIR"

# Define file paths
BASENAME=$(basename "$INPUT_VIDEO")
AUDIO_FILE="${ROOT_DIR}/${BASENAME}.mp3"
ASS_FILE="${ROOT_DIR}/${BASENAME}.ass"  # ASS file instead of SRT
VIDEOS_CROPPED_STACKED_DIR="${ROOT_DIR}/videos-cropped-stacked"

echo "Running ASS workflow in $ROOT_DIR"

# Step 1: Extract audio from your video
echo "========== Extract audio =========="
python clipper.py extract-audio --video-file "$INPUT_VIDEO" --audio-file "$AUDIO_FILE"

# Step 2: Generate ASS subtitles with word-level karaoke highlighting
echo "========== Generate ASS subtitles with word highlighting =========="
python clipper.py transcribe-word-level-ass --audio-file "$AUDIO_FILE" --output-ass-file "$ASS_FILE" --words-per-subtitle 3

# Display some info about the generated ASS file
echo "========== Generated ASS file info =========="
echo "ASS file location: $ASS_FILE"
echo "First few lines of ASS file:"
head -20 "$ASS_FILE"

# Step 3: Test embedding ASS subtitles into original video
echo "========== Embed ASS subtitles into video =========="
mkdir -p "$VIDEOS_CROPPED_STACKED_DIR"
python clipper.py embed-subtitles --video-file "$INPUT_VIDEO" --srt-file "$ASS_FILE" --output-file "${ROOT_DIR}/${BASENAME}_with_ass_subtitles.mp4"

echo "========== ASS Workflow Complete! =========="
echo "Output files:"
echo "  - Audio: $AUDIO_FILE"
echo "  - ASS subtitles: $ASS_FILE"
echo "  - Video with ASS subtitles: ${ROOT_DIR}/${BASENAME}_with_ass_subtitles.mp4"
echo ""
echo "The ASS file contains karaoke-style timing that will highlight each word as it's spoken!"
echo "You can also manually edit the ASS file to:"
echo "  - Change highlight colors (modify the Style: Highlight line)"
echo "  - Adjust font size and positioning"
echo "  - Customize the highlighting effect" 