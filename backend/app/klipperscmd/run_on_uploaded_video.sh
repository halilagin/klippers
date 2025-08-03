#!/bin/bash

# Default values
INPUT_VIDEO="${VIDEO_WAREHOUSE_ROOT_DIR}/${USER_ID}/${VIDEO_ID}/original.mp4"

# Generate timestamp and random string
TIMESTAMP=000 # $(date +%Y%m%d%H%M%S)
RANDOM_STRING=000 #$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)
ROOT_DIR="${VIDEO_WAREHOUSE_ROOT_DIR}/${USER_ID}/${VIDEO_ID}"

env

# Create the root directory
mkdir -p "$ROOT_DIR"

# Define file paths
BASENAME=$(basename "$INPUT_VIDEO")
AUDIO_FILE="${ROOT_DIR}/${BASENAME}.mp3"
SRT_FILE="${ROOT_DIR}/${BASENAME}.srt"
TXT_FILE="${ROOT_DIR}/${BASENAME}.txt"
IMPORTANT_SEGMENTS_VIDEO_DIR="${ROOT_DIR}/important-segment-videos"
IMPORTANT_SEGMENTS_JSON_FILE="${ROOT_DIR}/important_segments_videos.json"
VIDEOS_CROPPED_STACKED_DIR="${ROOT_DIR}/videos-cropped-stacked"

# Set Python environment
POETRY_VENV_PATH="/Users/halilagin/Library/Caches/pypoetry/virtualenvs/app-C1FwTKfV-py3.11"
export PYTHONPATH="$POETRY_VENV_PATH/lib/python3.11/site-packages:$PYTHONPATH"
PYTHON_EXEC="$POETRY_VENV_PATH/bin/python"

echo "Running all steps in $ROOT_DIR"

# Extract audio
# echo "========== Extract audio =========="
$PYTHON_EXEC clipper.py extract-audio --video-file "$INPUT_VIDEO" --audio-file "$AUDIO_FILE"


# Transcribe
# echo "========== Transcribe =========="
$PYTHON_EXEC clipper.py transcribe --audio-file "$AUDIO_FILE" --output-srt-file "$SRT_FILE"


# Convert SRT to TXT
# echo "========== Convert SRT to TXT =========="
$PYTHON_EXEC clipper.py convert-srt-to-txt --srt-file "$SRT_FILE" --txt-file "$TXT_FILE"

# # Important segments
# echo "========== Important segments =========="
$PYTHON_EXEC clipper.py important-segments --input-srt "$SRT_FILE" --output-file "$IMPORTANT_SEGMENTS_JSON_FILE" --segment-count "$SEGMENT_COUNT"

# Process
# echo "========== Extract Video Segments =========="
$PYTHON_EXEC clipper.py extract-video-segments --input-video "$INPUT_VIDEO" --important-segments-file-json "$IMPORTANT_SEGMENTS_JSON_FILE" --output-dir "$IMPORTANT_SEGMENTS_VIDEO_DIR" --srt-file "$SRT_FILE"


# echo "========== Crop and Stack Videos =========="

$PYTHON_EXEC clipper.py crop-and-stack --input-video-path "$IMPORTANT_SEGMENTS_VIDEO_DIR/segment_1.mp4" --output-video-path "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4"

# echo "========== Embed Subtitles in Stacked Video =========="


# Extract audio and transcribe for the cropped videos
$PYTHON_EXEC clipper.py extract-audio --video-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4" --audio-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp3"

$PYTHON_EXEC clipper.py transcribe-word-level-ass --audio-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp3" --output-ass-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass" --words-per-subtitle 4


# $PYTHON_EXEC debug_ass_file.py "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass"


$PYTHON_EXEC clipper.py embed-subtitles --video-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4" --srt-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass" --output-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1_with_subtitles.mp4" --position-middle

# echo "All steps completed successfully!"
# echo "Output directory: $ROOT_DIR" 