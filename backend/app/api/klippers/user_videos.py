
# flake8: noqa: E501
import asyncio
import subprocess
from fastapi import WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Form, BackgroundTasks, Path, Request
from fastapi.responses import FileResponse, StreamingResponse
import json
import uuid
import aiofiles
import os
from pathlib import Path as FilePath
from app.actors.actor_chat import ActorChat
from app.schemas.schema_chat import ChatMessage
from fastapi import APIRouter
from app.schemas.schema_chat import WSConnection
from app.config import settings
from app.db.model_document import UserVideo, UserVideoStatus
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends
import mimetypes

router = APIRouter(prefix="/shorts", tags=["user_shorts"])


def get_user_videos(user_id: str, video_id: str) -> FilePath:
    """
    Constructs the path to a user's video directory or file.
    
    Args:
        user_id: The user identifier
        video_id: The video identifier  
        subfolder: Optional subfolder within the video directory
        
    Returns:
        FilePath object pointing to the video location
    """
    warehouse_dir = FilePath(settings.VIDEO_WAREHOUSE_ROOT_DIR)
    video_path = warehouse_dir / user_id / video_id / "videos-cropped-stacked"

    print("video_path", video_path)
    video_files = []
    if video_path.exists():
        # get files under this directory with file pattern segment_[0-9]+_with_subtitles.mp4
        for f in video_path.iterdir():
            print (f.name)
            
        video_files = [f.name for f in video_path.iterdir() if f.name.endswith('_with_subtitles.mp4')]

        print ("video_files", video_files)
    return video_files



@router.get("/video_ids")
async def get_videos(
    db: Session = Depends(get_db) # Option to use async subprocess
):
    user_id="user123"
    video_ids = db.query(UserVideo.video_id).filter(UserVideo.user_id == user_id).all()
    return [video_id[0] for video_id in video_ids]




@router.get("/shorts/{video_id}")
async def get_shorts(
    video_id: str = Path(..., description="ID of the video"),
    db: Session = Depends(get_db) # Option to use async subprocess
):
    user_id = "user123"  # TODO: Get from authenticated user
    video_filenames = get_user_videos(user_id, video_id)
    return video_filenames


@router.get("/shorts/serve/{video_id}/{short_filename}")
async def serve_video_file(
    request: Request,
    short_filename: str = Path(..., description="Path to the video file"),
    video_id: str = Path(..., description="ID of the video"),
    db: Session = Depends(get_db)
):
    """
    Serves a video file for video player consumption.
    Supports proper MIME types, range requests, and file streaming for video playback.
    """
    try:
        user_id = "user123"  # TODO: Get from authenticated user
        
        # Construct full file path using helper function
        warehouse_dir = FilePath(settings.VIDEO_WAREHOUSE_ROOT_DIR)
        full_file_path = warehouse_dir / user_id / video_id / "videos-cropped-stacked" / short_filename
        
        # Security check: ensure path is within warehouse directory
        if not str(full_file_path.resolve()).startswith(str(warehouse_dir.resolve())):
            raise HTTPException(status_code=403, detail="Access denied")
        
        # Check if file exists
        if not full_file_path.exists() or not full_file_path.is_file():
            raise HTTPException(status_code=404, detail="Video file not found")
        
        # Get MIME type for the video file
        mime_type, _ = mimetypes.guess_type(str(full_file_path))
        if not mime_type or not mime_type.startswith('video/'):
            mime_type = 'video/mp4'  # Default to mp4 if can't determine
        
        # Get file size
        file_size = full_file_path.stat().st_size
        
        # Handle range requests for video seeking
        range_header = request.headers.get('Range')
        if range_header:
            # Parse range header (e.g., "bytes=0-1023")
            try:
                ranges = range_header.replace('bytes=', '').split('-')
                start = int(ranges[0]) if ranges[0] else 0
                end = int(ranges[1]) if ranges[1] else file_size - 1
                
                # Validate range
                if start >= file_size or end >= file_size or start > end:
                    raise HTTPException(status_code=416, detail="Range not satisfiable")
                
                # Create streaming response for range request
                def iter_file_range():
                    with open(full_file_path, 'rb') as file:
                        file.seek(start)
                        remaining = end - start + 1
                        chunk_size = 8192
                        while remaining > 0:
                            chunk = file.read(min(chunk_size, remaining))
                            if not chunk:
                                break
                            remaining -= len(chunk)
                            yield chunk
                
                headers = {
                    "Content-Range": f"bytes {start}-{end}/{file_size}",
                    "Accept-Ranges": "bytes",
                    "Content-Length": str(end - start + 1),
                    "Cache-Control": "no-cache",
                }
                
                return StreamingResponse(
                    iter_file_range(),
                    status_code=206,  # Partial Content
                    media_type=mime_type,
                    headers=headers
                )
            except (ValueError, IndexError):
                # Invalid range header, fall back to full file
                pass
        
        # Return full file if no range request or invalid range
        return FileResponse(
            path=str(full_file_path),
            media_type=mime_type,
            filename=full_file_path.name,
            headers={
                "Accept-Ranges": "bytes",
                "Cache-Control": "no-cache",
                "Content-Length": str(file_size),
            }
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error serving video file: {str(e)}")


