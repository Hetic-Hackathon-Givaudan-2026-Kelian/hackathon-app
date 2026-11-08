from collections.abc import AsyncIterator
from typing import Protocol

from .events import AgentEvent, Message


class AgentPort(Protocol):
    def run(self, message: str, history: list[Message]) -> AsyncIterator[AgentEvent]: ...
