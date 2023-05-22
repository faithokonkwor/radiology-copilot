from functools import lru_cache
from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    secret_key: str = Field(default="change-me-in-production")
    access_token_expire_minutes: int = 60
    database_url: str = "postgresql+asyncpg://radiology:radiology@localhost:5432/radiology_copilot"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4.1-mini"
    cors_origins: str = "http://localhost:3000"
    upload_dir: str = "uploads"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
