import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Azure OpenAI
    AZURE_OPENAI_ENDPOINT: str = os.getenv("AZURE_OPENAI_ENDPOINT", "https://app-uoaihack6zs3w.azurewebsites.net")
    AZURE_OPENAI_KEY: str = os.getenv("AZURE_OPENAI_KEY", "yk226Hj6hcfs3IwIzo78I4PIEsq9CPO3v1o8ovcfbHmR9mnW")
    AZURE_OPENAI_MODEL: str = os.getenv("AZURE_OPENAI_MODEL", "gpt-5.4")
    AZURE_OPENAI_VERSION: str = os.getenv("AZURE_OPENAI_VERSION", "2024-12-01-preview")

    # Standard OpenAI key — used for Whisper transcription if provided
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "preppath-secret-change-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./preppath.db")

    # Microsoft Graph API (requires Azure App Registration)
    MS_CLIENT_ID: str = os.getenv("MS_CLIENT_ID", "")
    MS_CLIENT_SECRET: str = os.getenv("MS_CLIENT_SECRET", "")
    MS_TENANT_ID: str = os.getenv("MS_TENANT_ID", "common")
    MS_REDIRECT_URI: str = os.getenv("MS_REDIRECT_URI", "http://localhost:8000/api/microsoft/callback")
    MS_FRONTEND_URL: str = os.getenv("MS_FRONTEND_URL", "http://localhost:5173")


settings = Settings()
