set -a
source .env
set +a

python app/db_polling/user_videos_polling.py 
