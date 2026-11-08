from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    agent_engine: Literal["pydantic_ai"] = "pydantic_ai"

    llm_provider: Literal["ollama", "mistral"] = "ollama"
    llm_model: str = "qwen3.5:4b"

    ollama_base_url: str = "http://host.docker.internal:11434/v1"
    mistral_api_key: str | None = None

    prompts_dir: str  = "../ia/prompts"


settings = Settings()