"""Microsoft Graph API integration for calendar sync.

Requires an Azure App Registration with Calendars.ReadWrite scope.
Set MS_CLIENT_ID, MS_CLIENT_SECRET, MS_TENANT_ID in .env to enable.
"""
from datetime import datetime, timedelta
from urllib.parse import urlencode

import httpx
from config import settings

_AUTH_BASE = "https://login.microsoftonline.com/{tenant}/oauth2/v2.0"
_GRAPH = "https://graph.microsoft.com/v1.0"
_SCOPES = "Calendars.ReadWrite offline_access"


def get_auth_url(state: str = "") -> str:
    params = {
        "client_id": settings.MS_CLIENT_ID,
        "response_type": "code",
        "redirect_uri": settings.MS_REDIRECT_URI,
        "scope": _SCOPES,
        "response_mode": "query",
        "state": state,
    }
    base = _AUTH_BASE.format(tenant=settings.MS_TENANT_ID)
    return f"{base}/authorize?{urlencode(params)}"


async def exchange_code(code: str) -> dict:
    url = _AUTH_BASE.format(tenant=settings.MS_TENANT_ID) + "/token"
    async with httpx.AsyncClient() as client:
        r = await client.post(url, data={
            "client_id": settings.MS_CLIENT_ID,
            "client_secret": settings.MS_CLIENT_SECRET,
            "code": code,
            "redirect_uri": settings.MS_REDIRECT_URI,
            "grant_type": "authorization_code",
        })
        r.raise_for_status()
        return r.json()


async def create_event(access_token: str, event: dict) -> dict:
    async with httpx.AsyncClient() as client:
        r = await client.post(
            f"{_GRAPH}/me/events",
            headers={"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"},
            json=event,
        )
        r.raise_for_status()
        return r.json()


async def sync_roadmap(access_token: str, roadmap_data: dict, interview_date_str: str) -> list[str]:
    try:
        interview_date = datetime.strptime(interview_date_str, "%Y-%m-%d")
    except (ValueError, TypeError):
        interview_date = datetime.utcnow() + timedelta(weeks=3)

    start_date = interview_date - timedelta(weeks=3)
    role = roadmap_data.get("role", "Interview")
    company = roadmap_data.get("company", "Company")
    created: list[str] = []

    for week in roadmap_data.get("weeks", []):
        week_num = week.get("num", 1)
        week_start = start_date + timedelta(weeks=(week_num - 1))

        for i, task in enumerate(week.get("tasks", [])):
            task_date = week_start + timedelta(days=(i * 2) % 5)
            time_str = task.get("time", "30m")
            minutes = int(time_str.replace("m", "")) if "m" in time_str else int(time_str.replace("h", "")) * 60

            ev_start = task_date.replace(hour=9, minute=0, second=0)
            ev_end = ev_start + timedelta(minutes=minutes)

            event = {
                "subject": f"PrepPath: {task.get('title', 'Prep Task')}",
                "body": {
                    "contentType": "text",
                    "content": f"Type: {task.get('type','Practice')}\nDuration: {time_str}\nPart of your PrepPath prep for {role} at {company}.",
                },
                "start": {"dateTime": ev_start.isoformat(), "timeZone": "UTC"},
                "end": {"dateTime": ev_end.isoformat(), "timeZone": "UTC"},
                "categories": ["PrepPath"],
            }
            result = await create_event(access_token, event)
            created.append(result.get("id", ""))

    # Interview day event
    i_start = interview_date.replace(hour=10, minute=0, second=0)
    interview_event = {
        "subject": f"INTERVIEW: {role} at {company}",
        "body": {"contentType": "text", "content": f"Interview for {role} at {company}. Prepared with PrepPath."},
        "start": {"dateTime": i_start.isoformat(), "timeZone": "UTC"},
        "end": {"dateTime": (i_start + timedelta(hours=1)).isoformat(), "timeZone": "UTC"},
        "importance": "high",
        "categories": ["PrepPath", "Interview"],
    }
    result = await create_event(access_token, interview_event)
    created.append(result.get("id", ""))

    return created
