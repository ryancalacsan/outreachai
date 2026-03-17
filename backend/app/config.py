from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    anthropic_api_key: str = ""
    gemini_api_key: str = ""
    demo_access_code: str = ""

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
