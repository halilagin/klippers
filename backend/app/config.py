from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    GMAIL_EMAIL: str
    GMAIL_APP_PASSWORD: str
    EMAIL_INTERVAL_SECONDS: int
    EMAIL_SENDER_NAME: str
    EMAIL_SENDER_EMAIL: str
    SIGNING_CALLBACK_URL: str
    STRIPE_SECRET_KEY: str
    STRIPE_DEFAULT_CURRENCY: str
    STRIPE_PAY_AS_YOU_GO_PRODUCT_ID: str
    STRIPE_METERED_PRODUCT_ID: str
    STRIPE_MONTHLY_PRODUCT_ID: str
    STRIPE_PAY_AS_YOU_GO_PRICE: int
    SIGNING_CALLBACK_URL_SIGNED_PDF_VIEW: str
    ACTIVATE_EMAIL_SENDING: bool = True
    ACTIVATE_STRIPE_METERING: bool = True
    ACTIVATE_SIGNING_PDF: bool = True
    ACTIVATE_PSQL_BACKUP: bool = False
    DB_BACKUP_CONTAINER_NAME: str
    DB_BACKUP_DB_NAME: str
    DB_BACKUP_DB_USER: str
    DB_BACKUP_DIR: str
    DB_BACKUP_DATE_FORMAT: str
    DB_BACKUP_FILE: str
    DB_BACKUP_DAYS_TO_KEEP: int
    DB_BACKUP_S3_BUCKET_NAME: str

    VIDEO_WAREHOUSE_ROOT_DIR: str
    BACKEND_WORKING_DIR: str
    SEGMENT_COUNT: int
    OPENAI_API_KEY: str
    KLIPPERS_RUN_SCRIPT: str
    KLIPPERS_CMD_CLIPPER_PY: str

    class Config:
        env_file = ".env"


settings = Settings()
