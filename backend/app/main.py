from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.generate import router as generate_router

app = FastAPI(
    title="OutreachAI API",
    description="Python FastAPI backend for LLM-powered patient outreach message generation",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["POST", "GET"],
    allow_headers=["*"],
)

app.include_router(generate_router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}
