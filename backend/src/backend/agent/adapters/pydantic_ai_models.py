from collections.abc import Callable

from pydantic_ai.models import Model

from backend.config import Settings


def _ollama(settings: Settings) -> Model:
    from pydantic_ai.models.ollama import OllamaModel
    from pydantic_ai.providers.ollama import OllamaProvider

    return OllamaModel(
        settings.llm_model,
        provider=OllamaProvider(base_url=settings.ollama_base_url),
    )


def _mistral(settings: Settings) -> Model:
    from pydantic_ai.models.mistral import MistralModel
    from pydantic_ai.providers.mistral import MistralProvider

    return MistralModel(
        settings.llm_model,
        provider=MistralProvider(api_key=settings.mistral_api_key),
    )


_MODEL_BUILDERS: dict[str, Callable[[Settings], Model]] = {
    "ollama": _ollama,
    "mistral": _mistral,
}


def build_model(settings: Settings) -> Model:
    builder = _MODEL_BUILDERS.get(settings.llm_provider)
    if builder is None:
        raise ValueError(f"Fournisseur LLM inconnu : {settings.llm_provider}")
    return builder(settings)
