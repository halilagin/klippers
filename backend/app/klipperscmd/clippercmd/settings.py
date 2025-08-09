# clipper/clippercmd/settings.py

from dotenv import load_dotenv
import os


class Settings:
    """Loads and holds application settings."""
    def __init__(self):
        # Load environment variables from a .env file
        load_dotenv()
        self.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
        