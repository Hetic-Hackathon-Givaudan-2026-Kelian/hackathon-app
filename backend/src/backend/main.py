from fastapi import FastAPI
from backend.api.chat import router as chat_router

app = FastAPI()

app.include_router(chat_router)


@app.get("/health")
def get_server_health():
    return {"status": "ok"}
