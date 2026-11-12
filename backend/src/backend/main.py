from fastapi import FastAPI

from backend.api.briefs import router as briefs_router
from backend.api.chat import router as chat_router

app = FastAPI()

app.include_router(chat_router)
app.include_router(briefs_router)


@app.get("/health")
def get_server_health():
    return {"status": "ok"}
