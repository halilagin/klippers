
# flake8: noqa: E501
import asyncio
import subprocess
from fastapi import WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException, Form, BackgroundTasks
import json
import uuid
import aiofiles
import os
from pathlib import Path
from app.actors.actor_chat import ActorChat
from app.schemas.schema_chat import ChatMessage
from fastapi import APIRouter
from app.schemas.schema_chat import WSConnection
from app.config import settings
from app.db.model_document import UserVideo, UserVideoStatus
from app.db.database import get_db
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/videoupload", tags=["videoupload"])








@router.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    background_tasks: BackgroundTasks = BackgroundTasks(),
    use_async: bool = Form(False) ,
    db: Session = Depends(get_db) # Option to use async subprocess
):
    """
    Handles uploading of large video files (60-100MB).
    Saves the file and then triggers video processing.
    """
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="File must be a video")
    
    # Generate unique video ID
    video_id = str(uuid.uuid4())
    
    try:
        # Create directory structure
        video_dir = Path(settings.VIDEO_WAREHOUSE_ROOT_DIR) / user_id / video_id
        video_dir.mkdir(parents=True, exist_ok=True)
        
        # Determine file extension from original filename
        file_extension = Path(file.filename).suffix if file.filename else '.mp4'
        video_file_path = video_dir / f"original{file_extension}"
        
        # Save uploaded file in chunks to handle large files
        chunk_size = 8192  # 8KB chunks
        async with aiofiles.open(video_file_path, 'wb') as f:
            while chunk := await file.read(chunk_size):
                await f.write(chunk)
        
        print(f"Video uploaded successfully: {video_file_path}")
        print(f"File size: {video_file_path.stat().st_size} bytes")
        
        # Save video to database
        user_video = UserVideo(
            user_id=user_id,
            video_id=video_id,
            status=UserVideoStatus.UPLOADED.value,
            meta_data={}
        )
        db.add(user_video)
        db.commit()


        
        
        return {
            "message": f"Video uploaded successfully",
            "user_id": user_id,
            "video_id": video_id,
            "status_endpoint": f"/videoupload/status/{user_id}/{video_id}"
        }
        
    except Exception as e:
        print(f"Error during video upload: {e}")
        # Clean up partial file if it exists
        raise HTTPException(status_code=500, detail=f"Video upload failed")
    
    finally:
        # Close the uploaded file
        await file.close()


