import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from services.openai_service import chat
from routers.auth import get_optional_user
from models.session import PracticeSession

router = APIRouter(prefix="/api", tags=["feedback"])

_SYSTEM = "You are an expert interview coach. You always respond with valid JSON and nothing else."

_PROMPT = """Score the candidate's interview answer below.
Return ONLY a single JSON object with this exact shape:

{{
  "score": <0-100>,
  "headline": "<3-5 word verdict>",
  "metrics": [
    {{"label": "Content relevance",  "score": <0-10>}},
    {{"label": "Delivery & clarity", "score": <0-10>}},
    {{"label": "Timing",             "score": <0-10>}},
    {{"label": "Confidence signals", "score": <0-10>}}
  ],
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"],
  "filler_words": ["<word1>", "<word2>"],
  "filler_count": <integer>
}}

--- Interview Question ---
{question}

--- Candidate's Answer ---
{transcript}
"""


class FeedbackRequest(BaseModel):
    question: str
    transcript: str
    roadmap_id: str = ""


@router.post("/feedback")
async def feedback(
    req: FeedbackRequest,
    db: Session = Depends(get_db),
    user=Depends(get_optional_user),
):
    prompt = _PROMPT.format(question=req.question, transcript=req.transcript)
    try:
        data = await chat(_SYSTEM, prompt, 800)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    if user:
        row = PracticeSession(
            user_id=user.id,
            roadmap_id=req.roadmap_id or None,
            question=req.question,
            transcript=req.transcript,
            feedback_data=json.dumps(data),
            score=data.get("score"),
        )
        db.add(row)
        db.commit()

    return data
