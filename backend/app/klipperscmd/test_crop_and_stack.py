#!/usr/bin/env python3
"""
Test script for the enhanced crop_and_stack function.
Usage: python test_crop_and_stack.py input_video.mp4 output_video.mp4
"""

import sys
import os

# Add current directory to path for local imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from clippercmd.crop_and_stack import _crop_and_stack  # noqa: E402


def main():
    if len(sys.argv) != 3:
        print("Usage: python test_crop_and_stack.py <input_video.mp4> "
              "<output_video.mp4>")
        print("Example: python test_crop_and_stack.py meeting.mp4 "
              "stacked_meeting.mp4")
        sys.exit(1)
    
    input_video = sys.argv[1]
    output_video = sys.argv[2]
    
    if not os.path.exists(input_video):
        print(f"Error: Input video '{input_video}' not found.")
        sys.exit(1)
    
    print("Testing enhanced crop_and_stack function...")
    print(f"Input: {input_video}")
    print(f"Output: {output_video}")
    print("-" * 50)
    
    try:
        _crop_and_stack(input_video, output_video)
        print("-" * 50)
        print("✅ Test completed successfully!")
        print(f"Check the output: {output_video}")
    except Exception as e:
        print(f"❌ Error during processing: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main() 