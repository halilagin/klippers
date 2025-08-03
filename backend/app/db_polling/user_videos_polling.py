# from datetime import time
# flake8: noqa: E501
from datetime import datetime
import time
import uuid
import os
import logging
# import app.config as appConfig
from app.db.database import SessionLocal

from app.db.model_document import UserVideo, UserVideoStatus
from dotenv import load_dotenv
import subprocess


# --- Configure Logging for the Email Thread ---
log_file_name = 'user_videos_polling.log'
logger = logging.getLogger('UserVideosPollingLogger')
logger.setLevel(logging.INFO)  # Set the minimum level to log

# Prevent adding multiple handlers if this module is reloaded somehow
if not logger.hasHandlers():
    # Create a file handler to write logs to a file
    file_handler = logging.FileHandler(log_file_name)

    # Create a formatter for the log messages
    formatter = logging.Formatter('%(asctime)s - [PID:%(process)d] - %(levelname)s - %(message)s', datefmt='%Y-%m-%d %H:%M:%S')
    file_handler.setFormatter(formatter)

    # Add the handler to the logger
    logger.addHandler(file_handler)
# --- End Logging Configuration ---




def run_cmd_process_video(user_id: str, video_id: str):
    """
    Spawns a new shell process and executes the video processing script
    Uses proper process management to prevent defunct processes
    """
    try:
        os.makedirs(f"{os.getenv('VIDEO_WAREHOUSE_ROOT_DIR')}/{user_id}/{video_id}", exist_ok=True)

        cmd_client_path = "run_on_uploaded_video.sh"
        command = ["/bin/bash", cmd_client_path]
        
        input_env = os.environ.copy()
        input_env["USER_ID"] = user_id
        input_env["VIDEO_ID"] = video_id
        
        
        # Create file paths for stdout/stderr
        stdout_path = f"{os.getenv('VIDEO_WAREHOUSE_ROOT_DIR')}/{user_id}/{video_id}/klippers.stdout"
        stderr_path = f"{os.getenv('VIDEO_WAREHOUSE_ROOT_DIR')}/{user_id}/{video_id}/klippers.stderr"
        
        # Open files with proper context management
        stdout_file = open(stdout_path, "w")
        stderr_file = open(stderr_path, "w")
        
        # Execute the command
        process = subprocess.Popen(
            command,
            stdout=stdout_file,
            stderr=stderr_file,
            text=True,
            cwd=os.getenv('BACKEND_WORKING_DIR'),
            env=input_env
        )
        
        return True
    except Exception as e:
        logger.error(f"Error running command: {e}")
        return False



def process_user_video(user_video: UserVideo):
    """
    Record stripe metered usage for a document

    Args:
        db: Database session
        document_id: ID of the document
        user_email: Email of the user
        quantity: Number of units to record (default 1)
    """
    logger.info(f"Starting video processing for user_id: {user_video.user_id} and video_id: {user_video.video_id}")

    run_cmd_process_video(user_video.user_id, user_video.video_id)


def process_user_videos_in_batches():
    """
    Send emails to signers in batches with explicit DB session
    """
    logger.info(f"Process {os.getpid()} - Attempting to sign the pdfs...")
    # Create a new DB session explicitly
    db = SessionLocal()
    try:
        # Set the session on DocumentDAO
        
        unprocessed_user_videos = db.query(UserVideo).filter(UserVideo.status == UserVideoStatus.UPLOADED.value).all()
        logger.info(f"Found {len(unprocessed_user_videos)} user videos to process.")
        for index, user_video in enumerate(unprocessed_user_videos):
            if index == 0:
                logger.info(f" Process {os.getpid()} - Attempting to process the user video for user_id: {user_video.user_id} and video_id: {user_video.video_id}...")
            try:
                process_user_video(user_video)
            except Exception as e:
                logger.error(f"An unexpected error occurred in stripe document meter loop: {e}", exc_info=True)
    except Exception as e:
        logger.error(f"An unexpected error occurred in user videos polling loop: {e}", exc_info=True)
    finally:
        # Always close the DB session

        db.close()


def poll_user_videos_loop(interval_seconds: int):
    """
    Periodically sends a test email using credentials from environment variables.
    Logs output to the 'EmailThreadLogger'.
    """
    process_id = os.getpid()
    while True:
        logger.info(f"Process {process_id} checking for documents to send email for view of signed document...")
        process_user_videos_in_batches()
        time.sleep(interval_seconds)

# Example Usage (Update credentials for Gmail)
if __name__ == "__main__":
    load_dotenv()
    logger.info(f"Starting user videos polling batch process...")
    process_user_videos_in_batches()
    logger.info(f"User videos polling batch process finished.")