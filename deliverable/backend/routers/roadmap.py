from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

from services.openai_service import chat

router = APIRouter(prefix="/api", tags=["roadmap"])

_SYSTEM = "You are an expert interview coach. You always respond with valid JSON and nothing else."


class FeedbackEntry(BaseModel):
    question: str
    score: int
    weak_areas: List[str] = []


class AdaptRequest(BaseModel):
    roadmap_data: dict
    feedback_history: List[FeedbackEntry]
    completed_weeks: List[int] = []


@router.post("/roadmap/adapt")
async def adapt_roadmap(req: AdaptRequest):
    """Re-generate remaining roadmap weeks to focus on areas where feedback scores are low."""
    if not req.feedback_history:
        raise HTTPException(status_code=400, detail="No feedback history supplied")

    avg = sum(f.score for f in req.feedback_history) / len(req.feedback_history)
    weak = list({area for f in req.feedback_history for area in f.weak_areas})

    prompt = f"""A candidate is preparing for a {req.roadmap_data.get('role', 'role')} interview.
Average practice score so far: {avg:.0f}/100.
Identified weak areas: {', '.join(weak) if weak else 'none yet'}.
Already completed weeks: {req.completed_weeks}.

Current roadmap JSON:
{req.roadmap_data}

Rewrite the REMAINING (not-yet-completed) weeks so tasks target the weak areas.
Keep the same JSON structure. Also provide 8 updated mock questions targeting weak areas.

Return ONLY:
{{
  "weeks": [ ...updated weeks... ],
  "questions": [ ...8 updated questions... ],
  "adaptation_notes": "<1-2 sentence explanation of changes>"
}}
"""
    try:
        return await chat(_SYSTEM, prompt, 2000)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
