from typing import Any, Literal

from pydantic import BaseModel


class TextEvent(BaseModel):
    type: Literal["text"] = "text"
    content: str

class ToolCallEvent(BaseModel):
    type: Literal["tool_call"] = "tool_call"
    tool_name: str
    arguments: dict[str, Any]


class ToolResultEvent(BaseModel):
    type: Literal["tool_result"] = "tool_result"
    tool_name: str
    result: Any


class DoneEvent(BaseModel):
    type: Literal["done"] = "done"


class ErrorEvent(BaseModel):
    type: Literal["error"] = "error"
    message: str


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


AgentEvent = TextEvent | ToolCallEvent | ToolResultEvent | DoneEvent | ErrorEvent
