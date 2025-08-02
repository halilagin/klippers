#!/bin/bash

# Default values
INPUT_VIDEO=${1:-"podcast01.mp4"}
SEGMENT_COUNT=${2:-10}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --input-video)
            INPUT_VIDEO="$2"
            shift 2
            ;;
        --segment-count)
            SEGMENT_COUNT="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [--input-video VIDEO_FILE] [--segment-count COUNT]"
            echo ""
            echo "Options:"
            echo "  --input-video VIDEO_FILE    Path to the long video file (default: podcast.mp4)"
            echo "  --segment-count COUNT       Target segment duration in minutes (default: 10)"
            echo "  -h, --help                  Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if input video exists
if [[ ! -f "$INPUT_VIDEO" ]]; then
    echo "Error: Input video file '$INPUT_VIDEO' does not exist"
    exit 1
fi

# Generate timestamp and random string
TIMESTAMP=000 # $(date +%Y%m%d%H%M%S)
RANDOM_STRING=000 #$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)
ROOT_DIR="podcast-output-${TIMESTAMP}-${RANDOM_STRING}"

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

echo "Running all steps in $ROOT_DIR"

# Extract audio
# echo "========== Extract audio =========="
# python clipper.py extract-audio --video-file "$INPUT_VIDEO" --audio-file "$AUDIO_FILE"


# Transcribe
# echo "========== Transcribe =========="
# python clipper.py transcribe --audio-file "$AUDIO_FILE" --output-srt-file "$SRT_FILE"


# Convert SRT to TXT
# echo "========== Convert SRT to TXT =========="
# python clipper.py convert-srt-to-txt --srt-file "$SRT_FILE" --txt-file "$TXT_FILE"

# # Important segments
# echo "========== Important segments =========="
# python clipper.py important-segments --input-srt "$SRT_FILE" --output-file "$IMPORTANT_SEGMENTS_JSON_FILE" --segment-count "$SEGMENT_COUNT"

# Process
# echo "========== Extract Video Segments =========="
# python clipper.py extract-video-segments --input-video "$INPUT_VIDEO" --important-segments-file-json "$IMPORTANT_SEGMENTS_JSON_FILE" --output-dir "$IMPORTANT_SEGMENTS_VIDEO_DIR" --srt-file "$SRT_FILE"


# echo "========== Crop and Stack Videos =========="

# python clipper.py crop-and-stack --input-video-path "$IMPORTANT_SEGMENTS_VIDEO_DIR/segment_1.mp4" --output-video-path "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4"

# echo "========== Embed Subtitles in Stacked Video =========="


# Extract audio and transcribe for the cropped videos
# python clipper.py extract-audio --video-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4" --audio-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp3"

# python clipper.py transcribe-word-level-ass --audio-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp3" --output-ass-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass" --words-per-subtitle 4


# python debug_ass_file.py "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass"


# python clipper.py embed-subtitles --video-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.mp4" --srt-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1.ass" --output-file "$VIDEOS_CROPPED_STACKED_DIR/segment_1_with_subtitles.mp4" --position-middle

# echo "All steps completed successfully!"
# echo "Output directory: $ROOT_DIR" 