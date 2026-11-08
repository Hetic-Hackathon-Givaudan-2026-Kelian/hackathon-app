from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def get_server_health():
    return {"status": "ok"}