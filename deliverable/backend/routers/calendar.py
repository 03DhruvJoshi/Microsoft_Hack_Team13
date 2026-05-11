from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel

from services.calendar_service import generate_ics

router = APIRouter(prefix="/api", tags=["calendar"])


class CalendarRequest(BaseModel):
    roadmap_data: dict
    interview_date: str = ""


@router.post("/calendar/download")
async def download_calendar(req: CalendarRequest):
    """Return a real ICS file built from the roadmap tasks and interview date."""
    try:
        ics = generate_ics(req.roadmap_data, req.interview_date)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return Response(
        content=ics,
        media_type="text/calendar",
        headers={"Content-Disposition": 'attachment; filename="preppath_schedule.ics"'},
    )
