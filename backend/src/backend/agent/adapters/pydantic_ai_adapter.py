from collections.abc import AsyncIterator
from pathlib import Path

from pydantic_ai import (
    Agent,
    FunctionToolCallEvent,
    FunctionToolResultEvent,
    PartDeltaEvent,
    PartStartEvent,
    TextPartDelta,
)
from pydantic_ai.messages import (
    ModelMessage,
    ModelRequest,
    ModelResponse,
    TextPart,
    UserPromptPart,
)

from backend.agent.events import (
    AgentEvent,
    DoneEvent,
    ErrorEvent,
    Message,
    TextEvent,
    ToolCallEvent,
    ToolResultEvent,
)
from backend.config import settings
from backend.tools import ALL_TOOLS

from .pydantic_ai_models import build_model


def _load_instructions() -> str:
    path = Path(settings.prompts_dir) / "system.md"
    if path.exists():
        return path.read_text(encoding="utf-8")
    return "Tu es un assistant utile. Réponds en français."


def _to_history(history: list[Message]) -> list[ModelMessage]:
    messages: list[ModelMessage] = []
    for msg in history:
        if msg.role == "user":
            messages.append(ModelRequest(parts=[UserPromptPart(content=msg.content)]))
        else:
            messages.append(ModelResponse(parts=[TextPart(content=msg.content)]))
    return messages


class PydanticAIAgent:
    def __init__(self) -> None:
        self._agent = Agent(
            build_model(settings),
            instructions=_load_instructions(),
            tools=ALL_TOOLS,
        )

    async def run(
        self, message: str, history: list[Message]
    ) -> AsyncIterator[AgentEvent]:
        try:
            async with self._agent.run_stream_events(
                message, message_history=_to_history(history)
            ) as events:
                async for event in events:
                    if isinstance(event, PartStartEvent) and isinstance(
                        event.part, TextPart
                    ):
                        if event.part.content:
                            yield TextEvent(content=event.part.content)
                    elif isinstance(event, PartDeltaEvent) and isinstance(
                        event.delta, TextPartDelta
                    ):
                        yield TextEvent(content=event.delta.content_delta)
                    elif isinstance(event, FunctionToolCallEvent):
                        yield ToolCallEvent(
                            tool_name=event.part.tool_name,
                            arguments=event.part.args_as_dict(),
                        )
                    elif isinstance(event, FunctionToolResultEvent):
                        yield ToolResultEvent(
                            tool_name=event.part.tool_name,
                            result=event.part.content,
                        )
        except Exception as exc:  # noqa: BLE001
            yield ErrorEvent(message=str(exc))
            return

        yield DoneEvent()
