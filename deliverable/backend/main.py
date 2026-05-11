import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import AzureOpenAI

app = FastAPI(title="PrepPath API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ENDPOINT = "https://app-uoaihack6zs3w.azurewebsites.net"
MODEL_NAME = "gpt-5.4"
API_KEY = "yk226Hj6hcfs3IwIzo78I4PIEsq9CPO3v1o8ovcfbHmR9mnW"
API_VERSION = "2024-12-01-preview"

client = AzureOpenAI(
    api_version=API_VERSION,
    azure_endpoint=ENDPOINT,
    api_key=API_KEY,
)


def chat(system: str, user: str, max_tokens: int = 2000) -> dict:
    response = client.chat.completions.create(
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_completion_tokens=max_tokens,
        model=MODEL_NAME,
    )
    text = response.choices[0].message.content.strip()
    # Strip markdown code fences if the model wraps JSON in them
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


class AnalyzeRequest(BaseModel):
    cv_text: str
    job_description: str
    interview_date: str = ""


class FeedbackRequest(BaseModel):
    question: str
    transcript: str


@app.post("/api/analyze")
async def analyze(req: AnalyzeRequest):
    """
    Accepts a CV and job description, returns a personalised roadmap,
    skill-gap analysis, focus areas, and a set of mock interview questions.
    """
    system = (
        "You are an expert interview coach. "
        "You always respond with valid JSON and nothing else."
    )
    user = f"""Analyse the CV and job description below.
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
      "num": 1,
      "label": "Foundation",
      "tasks": [
        {{"id": "w1-1", "title": "<task>", "type": "Research", "time": "30m"}},
        {{"id": "w1-2", "title": "<task>", "type": "Practice", "time": "45m"}},
        {{"id": "w1-3", "title": "<task>", "type": "Practice", "time": "60m"}}
      ]
    }},
    {{
      "num": 2,
      "label": "Depth",
      "tasks": [
        {{"id": "w2-1", "title": "<task>", "type": "Research", "time": "60m"}},
        {{"id": "w2-2", "title": "<task>", "type": "Practice", "time": "45m"}},
        {{"id": "w2-3", "title": "<task>", "type": "Polish",   "time": "30m"}}
      ]
    }},
    {{
      "num": 3,
      "label": "Polish",
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
{req.cv_text}

--- Job Description ---
{req.job_description}

--- Interview Date ---
{req.interview_date if req.interview_date else "Not specified"}
"""
    try:
        return await _run(chat, system, user, 2000)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/feedback")
async def feedback(req: FeedbackRequest):
    """
    Accepts an interview question and the candidate's transcript.
    Returns a structured score, per-metric breakdown, strengths, and improvements.
    """
    system = (
        "You are an expert interview coach. "
        "You always respond with valid JSON and nothing else."
    )
    user = f"""Score the candidate's interview answer below.
Return ONLY a single JSON object with this exact shape:

{{
  "score": <0-100>,
  "headline": "<3–5 word verdict, e.g. 'a solid answer'>",
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
{req.question}

--- Candidate's Answer ---
{req.transcript}
"""
    try:
        return await _run(chat, system, user, 800)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# FastAPI route handlers must be async; wrap the sync `chat` helper
import asyncio
from functools import partial

async def _run(fn, *args, **kwargs):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(fn, *args, **kwargs))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
