from collections.abc import AsyncIterator

from pydantic import ValidationError

from backend.agent.events import (
    AgentEvent,
    DoneEvent,
    ErrorEvent,
    Message,
    TextEvent,
    ToolCallEvent,
    ToolResultEvent,
)
from backend.services.data_client import DataApiError, ask_assistant


class DataApiAgent:
    """Agent qui délègue la conversation à l'assistant de l'API data (/ask)."""

    async def run(
        self, message: str, history: list[Message]
    ) -> AsyncIterator[AgentEvent]:
        yield ToolCallEvent(
            tool_name="search_catalogue",
            arguments={"question": message},
        )

        try:
            response = await ask_assistant(message, [m.model_dump() for m in history])
        except (DataApiError, ValidationError):
            yield ErrorEvent(
                message="L'assistant est momentanément indisponible. Réessayez dans un instant."
            )
            return

        yield TextEvent(content=response.answer)

        if response.suggestions:
            yield ToolResultEvent(tool_name="suggestions", result=response.suggestions)

        if response.status == "recommendations_ready" and response.sources:
            yield ToolResultEvent(
                tool_name="recommend_aromas",
                result=[source.model_dump() for source in response.sources],
            )

        yield DoneEvent()
