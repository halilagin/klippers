# flake8: noqa: E501
# clipper/clippercmd/crop_and_stack.py

import cv2
import face_recognition
import numpy as np
import click
from moviepy import ImageSequenceClip
from clippercmd.utils import _calculate_dynamic_padding
import os
import subprocess
import tempfile

def _attach_audio_with_ffmpeg(input_video_path, video_without_audio_path, final_output_path):
    """
    Use ffmpeg to attach original audio from input video to the newly created video
    """
    try:
        print("Attaching original audio using ffmpeg...")
        
        # FFmpeg command to combine video (without audio) with audio from original
        ffmpeg_cmd = [
            'ffmpeg',
            '-i', video_without_audio_path,  # Video input (no audio)
            '-i', input_video_path,          # Audio source (original video)
            '-c:v', 'copy',                  # Copy video stream as-is
            '-c:a', 'aac',                   # Audio codec
            '-map', '0:v:0',                 # Map video from first input
            '-map', '1:a:0',                 # Map audio from second input
            '-shortest',                     # End when shortest stream ends
            '-y',                            # Overwrite output file
            final_output_path
        ]
        
        # Run ffmpeg command
        result = subprocess.run(ffmpeg_cmd, capture_output=True, text=True, check=True)
        print(f"Audio successfully attached. Final video saved to {final_output_path}")
        
        # Clean up temporary video file (without audio)
        if os.path.exists(video_without_audio_path):
            os.remove(video_without_audio_path)
            print(f"Cleaned up temporary file: {video_without_audio_path}")
            
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"Error running ffmpeg: {e}")
        print(f"FFmpeg stderr: {e.stderr}")
        return False
    except Exception as e:
        print(f"Error attaching audio: {e}")
        return False

def _crop_and_stack(input_video_path, output_video_path):
    cap = cv2.VideoCapture(input_video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    fps = cap.get(cv2.CAP_PROP_FPS)
    original_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    original_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Force 16:9 aspect ratio for Instagram compatibility
    # Calculate dimensions to maintain 16:9 aspect ratio
    target_aspect_ratio = 16.0 / 9.0
    
    # Use the original width as base and calculate height for 16:9
    output_width = original_width
    ideal_height = int(output_width / target_aspect_ratio)
    
    # Each speaker gets half the total height
    output_height = ideal_height
    speaker_height = output_height // 2

    # List to store individual frames for MoviePy
    processed_frames = []
    
    # Face tracking variables
    face_locations = []
    speaker_encodings = []  # Store face encodings to track consistent speakers
    speaker_positions = {}  # Map speaker encodings to positions (0=top, 1=bottom)
    next_speaker_id = 0

    frame_count = 0
    detection_interval = int(fps * 10)  # Detect faces every 10 seconds for stable ROI

    print(f"Processing video: {original_width}x{original_height} -> {output_width}x{output_height}")
    
    while cap.isOpened():
        if frame_count % 120 == 0:  # Print progress every 5 seconds at 24fps
            print(f"Processing frame {frame_count} ({frame_count/fps:.1f}s)")
            
        ret, frame = cap.read()
        if not ret:
            break

        # Convert BGR to RGB for face_recognition
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Detect faces periodically
        if frame_count % detection_interval == 0:
            face_locations = face_recognition.face_locations(rgb_frame, model="hog")
            
            # If faces detected, compute encodings for tracking
            if face_locations:
                current_encodings = face_recognition.face_encodings(rgb_frame, face_locations)
                
                # Match current faces with known speakers
                matched_speakers = []
                for encoding in current_encodings:
                    best_match_id = None
                    if speaker_encodings:
                        # Compare with known speakers
                        matches = face_recognition.compare_faces(speaker_encodings, encoding, tolerance=0.6)
                        if any(matches):
                            best_match_id = matches.index(True)
                    
                    if best_match_id is None:
                        # New speaker
                        speaker_encodings.append(encoding)
                        speaker_positions[next_speaker_id] = len(speaker_positions) % 2  # Alternate top/bottom
                        matched_speakers.append(next_speaker_id)
                        next_speaker_id += 1
                    else:
                        matched_speakers.append(best_match_id)
                
                # Sort face locations by their assigned positions
                face_speaker_pairs = list(zip(face_locations, matched_speakers))
                face_speaker_pairs.sort(key=lambda x: speaker_positions.get(x[1], 0))
                face_locations = [pair[0] for pair in face_speaker_pairs[:2]]  # Take max 2 speakers

        # Create output frame
        stacked_frame = np.zeros((output_height, output_width, 3), dtype=np.uint8)
        
        # Process detected faces (up to 2)
        for i, (top, right, bottom, left) in enumerate(face_locations[:2]):
            face_x, face_y = left, top
            face_w, face_h = right - left, bottom - top
            
            # Calculate better ROI with padding
            face_pad_x, face_pad_y = _calculate_dynamic_padding(
                face_w, face_h, 
                target_aspect_ratio=16.0/9.0,  # Wider aspect ratio for better framing
                overall_padding_factor=2.5  # Moderate padding
            )

            # Calculate ROI bounds
            x1 = max(0, face_x - face_pad_x)
            y1 = max(0, face_y - face_pad_y)
            x2 = min(frame.shape[1], face_x + face_w + face_pad_x)
            y2 = min(frame.shape[0], face_y + face_h + face_pad_y)
            
            roi_w, roi_h = x2 - x1, y2 - y1
            
            if roi_w > 0 and roi_h > 0:
                # Extract the region of interest
                speaker_crop = frame[y1:y2, x1:x2]
                
                # Resize to fit speaker's designated area while maintaining aspect ratio
                aspect_ratio = roi_w / roi_h
                target_width = output_width
                target_height = int(target_width / aspect_ratio)
                
                # If calculated height is too tall, fit by height instead
                if target_height > speaker_height:
                    target_height = speaker_height
                    target_width = int(target_height * aspect_ratio)
                
                # Resize the crop
                speaker_resized = cv2.resize(speaker_crop, (target_width, target_height))
                
                # Calculate position in output frame
                speaker_y_offset = i * speaker_height  # Top or bottom half
                
                # Center horizontally and vertically within the designated area
                start_x = (output_width - target_width) // 2
                start_y = speaker_y_offset + (speaker_height - target_height) // 2
                
                end_x = start_x + target_width
                end_y = start_y + target_height
                
                # Place the resized speaker in the output frame
                stacked_frame[start_y:end_y, start_x:end_x] = speaker_resized

        # Convert BGR to RGB for MoviePy
        processed_frames.append(cv2.cvtColor(stacked_frame, cv2.COLOR_BGR2RGB))
        frame_count += 1

    cap.release()

    # Create the final video using MoviePy (without audio first)
    if processed_frames:
        print(f"Creating video without audio with {len(processed_frames)} frames...")
        
        # Create temporary file for video without audio
        temp_video_path = output_video_path.replace('.mp4', '_temp_no_audio.mp4')
        
        clip = ImageSequenceClip(processed_frames, fps=fps)
        clip.write_videofile(temp_video_path, codec="libx264", audio=False)
        
        # Now attach the original audio using ffmpeg
        success = _attach_audio_with_ffmpeg(input_video_path, temp_video_path, output_video_path)
        
        if success:
            print(f"Final video with audio saved to {output_video_path}")
        else:
            print(f"Warning: Could not attach audio. Video without audio saved to {temp_video_path}")
    else:
        print("No frames processed. Output video not created.")

def _create_folder_if_not_exists(output_video_path):
    output_folder = os.path.dirname(output_video_path)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder, exist_ok=True)

@click.command('crop-and-stack')
@click.option('--input-video-path', type=click.Path(exists=True), required=True)
@click.option('--output-video-path', type=click.Path(), required=True)
def crop_and_stack_command(input_video_path, output_video_path):
    _create_folder_if_not_exists(output_video_path)
    _crop_and_stack(input_video_path, output_video_path)
