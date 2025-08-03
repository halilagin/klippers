# from datetime import time
# flake8: noqa: E501
from datetime import datetime
import time
import uuid
import os
import logging
import click
# import app.config as appConfig
from app.db.database import SessionLocal

from app.db.model_document import UserVideo, UserVideoStatus
from dotenv import load_dotenv
import subprocess

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def update_video_status_in_db(user_id: str, video_id: str, status: str, processing_started_at: str, processing_completed_at: str):
    """
    Update video status in database for a specific user and video
    """
    # Create a new DB session explicitly
    db = SessionLocal()
    try:
        # Set the session on DocumentDAO
        
        user_video = db.query(UserVideo).filter(UserVideo.user_id == user_id, UserVideo.video_id == video_id).first()
        if user_video:
            user_video.status = status
            if processing_started_at:
                user_video.processing_started_at = processing_started_at
            if processing_completed_at:
                user_video.processing_completed_at = processing_completed_at
            db.commit()
            logger.info(f"Updated video {video_id} status to {status} for user {user_id}")
        else:
            logger.error(f"User video not found: user_id={user_id}, video_id={video_id}")
            
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating video status: {e}")
        raise e
    finally:
        db.close()


@click.command()
@click.option('--user-id', required=True, help='User ID')
@click.option('--video-id', required=True, help='Video ID')
@click.option('--status', required=True, help='Video status to set')
@click.option('--processing-started-at', required=False, help='Processing started at')
@click.option('--processing-completed-at', required=False, help='Processing completed at')
def update_video_status_in_db_command(user_id: str, video_id: str, status: str, processing_started_at: str, processing_completed_at: str):
    """Update video status in database via command line."""
    load_dotenv()
    logger.info(f"Updating video status: user_id={user_id}, video_id={video_id}, status={status}")
    update_video_status_in_db(user_id, video_id, status, processing_started_at, processing_completed_at)
    logger.info("Video status update completed.")


# Example Usage
if __name__ == "__main__":
    update_status_cmd()