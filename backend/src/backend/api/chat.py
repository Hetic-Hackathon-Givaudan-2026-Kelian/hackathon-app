from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from backend.agent.events import Message
from backend.agent.factory import build_agent

router = APIRouter(prefix="/chat", tags=["Chat"])
agent = build_agent()


class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []


@router.post("")
async def chat(request: ChatRequest):

    async def generer():
        async for event in agent.run(request.message, request.history):
            yield f"data: {event.model_dump_json()}\n\n"

    return StreamingResponse(generer(), media_type="text/event_stream")
