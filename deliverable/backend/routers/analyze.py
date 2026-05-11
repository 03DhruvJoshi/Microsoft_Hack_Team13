import json
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from services.openai_service import chat
from routers.auth import get_optional_user
from models.roadmap import Roadmap

router = APIRouter(prefix="/api", tags=["analyze"])

_SYSTEM = "You are an expert interview coach. You always respond with valid JSON and nothing else."

_PROMPT = """Analyse the CV and job description below.
Return ONLY a single JSON object with this exact shape (no extra keys):

{{
  "candidate_name": "<first name from CV, or 'Candidate' if missing>",
  "role": "<job title from JD>",
  "company": "<company name from JD>",
  "days_to_interview": "<number of calendar days if date supplied, else 21>",
  "focus_areas": [
    {{"num": "01", "title": "<area>", "priority": "High"}},
    {{"num": "02", "title": "<area>", "priority": "Medium"}},
    {{"num": "03", "title": "<area>", "priority": "Low"}}
  ],
  "skill_gaps": [
    {{"skill": "<name>", "match": <0-100>}},
    {{"skill": "<name>", "match": <0-100>}},
    {{"skill": "<name>", "match": <0-100>}},
    {{"skill": "<name>", "match": <0-100>}},
    {{"skill": "<name>", "match": <0-100>}}
  ],
  "weeks": [
    {{
      "num": 1, "label": "Foundation",
      "tasks": [
        {{"id": "w1-1", "title": "<task>", "type": "Research", "time": "30m"}},
        {{"id": "w1-2", "title": "<task>", "type": "Practice", "time": "45m"}},
        {{"id": "w1-3", "title": "<task>", "type": "Practice", "time": "60m"}}
      ]
    }},
    {{
      "num": 2, "label": "Depth",
      "tasks": [
        {{"id": "w2-1", "title": "<task>", "type": "Research", "time": "60m"}},
        {{"id": "w2-2", "title": "<task>", "type": "Practice", "time": "45m"}},
        {{"id": "w2-3", "title": "<task>", "type": "Polish",   "time": "30m"}}
      ]
    }},
    {{
      "num": 3, "label": "Polish",
      "tasks": [
        {{"id": "w3-1", "title": "<task>", "type": "Practice", "time": "60m"}},
        {{"id": "w3-2", "title": "<task>", "type": "Research", "time": "20m"}}
      ]
    }}
  ],
  "questions": [
    "<behavioural question 1>",
    "<behavioural question 2>",
    "<role-specific question 3>",
    "<role-specific question 4>",
    "<situational question 5>",
    "<situational question 6>",
    "<culture/values question 7>",
    "<closing/motivation question 8>"
  ]
}}

--- CV ---
{cv_text}

--- Job Description ---
{job_description}

--- Interview Date ---
{interview_date}
"""


class AnalyzeRequest(BaseModel):
    cv_text: str
    job_description: str
    interview_date: str = ""


@router.post("/analyze")
async def analyze(
    req: AnalyzeRequest,
    db: Session = Depends(get_db),
    user=Depends(get_optional_user),
):
    prompt = _PROMPT.format(
        cv_text=req.cv_text,
        job_description=req.job_description,
        interview_date=req.interview_date or "Not specified",
    )
    try:
        data = await chat(_SYSTEM, prompt, 2000)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    # Persist for logged-in users
    if user:
        row = Roadmap(
            user_id=user.id,
            cv_text=req.cv_text,
            job_description=req.job_description,
            interview_date=req.interview_date,
            data=json.dumps(data),
        )
        db.add(row)
        db.commit()
        data["roadmap_id"] = row.id

    return data
