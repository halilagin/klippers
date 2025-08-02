# clipper/clippercmd/settings.py
import os
from dotenv import load_dotenv


class Settings:
    """Loads and holds application settings."""
    def __init__(self):
        # Load environment variables from a .env file
        load_dotenv()
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.gemini_api_key = os.getenv("GEMINI_API_KEY") 