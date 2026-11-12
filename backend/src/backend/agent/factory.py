from backend.agent.port import AgentPort
from backend.config import settings


def build_agent() -> AgentPort:
    if settings.agent_engine == "pydantic_ai":
        from backend.agent.adapters.pydantic_ai_adapter import PydanticAIAgent

        return PydanticAIAgent()
    if settings.agent_engine == "data_api":
        from backend.agent.adapters.data_api_adapter import DataApiAgent

        return DataApiAgent()
    raise ValueError(f"Moteur d'agent inconnu : {settings.agent_engine}")
