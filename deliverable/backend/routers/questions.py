from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from services.openai_service import chat

router = APIRouter(prefix="/api", tags=["questions"])

_SYSTEM = "You are an expert interview coach. You always respond with valid JSON and nothing else."


class RegenerateRequest(BaseModel):
    role: str
    company: str
    focus_areas: List[str]
    weak_topics: List[str] = []
    count: int = 8


@router.post("/questions/regenerate")
async def regenerate_questions(req: RegenerateRequest):
    """Generate targeted mock questions based on role, focus areas, and identified weak spots."""
    weak_str = (
        f"\nFocus extra questions on these weak areas: {', '.join(req.weak_topics)}"
        if req.weak_topics else ""
    )
    prompt = f"""Generate {req.count} high-quality mock interview questions for a {req.role} role at {req.company}.
Core focus areas: {', '.join(req.focus_areas)}{weak_str}

Return ONLY a JSON object with this shape:
{{
  "questions": [
    {{"text": "<question>", "type": "<Behavioural|Technical|Situational|Cultural>", "focus_area": "<area>"}}
  ]
}}
"""
    try:
        return await chat(_SYSTEM, prompt, 800)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
