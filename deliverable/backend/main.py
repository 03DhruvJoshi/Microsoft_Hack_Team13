from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_tables
from routers import auth, analyze, questions, transcription, feedback, calendar, roadmap, microsoft

app = FastAPI(
    title="PrepPath API",
    version="2.0.0",
    description="AI-powered interview preparation — modular backend",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    create_tables()


app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(questions.router)
app.include_router(transcription.router)
app.include_router(feedback.router)
app.include_router(calendar.router)
app.include_router(roadmap.router)
app.include_router(microsoft.router)


@app.get("/health")
def health():
    return {"status": "ok", "version": "2.0.0"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
