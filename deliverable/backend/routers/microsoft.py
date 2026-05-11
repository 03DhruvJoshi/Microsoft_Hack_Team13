"""Microsoft Calendar OAuth2 + sync endpoints.

Setup (Azure Portal):
  1. Register an app at https://portal.azure.com → Azure Active Directory → App registrations
  2. Add redirect URI: http://localhost:8000/api/microsoft/callback
  3. Add API permission: Microsoft Graph → Calendars.ReadWrite (delegated)
  4. Create a client secret
  5. Copy Client ID, Client Secret, Tenant ID into .env

Then users click "Connect Microsoft Calendar" in the UI → OAuth flow runs → events are created.
"""
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import Depends

from config import settings
from database import get_db
from routers.auth import get_optional_user
from services.microsoft_service import get_auth_url, exchange_code, sync_roadmap
from models.user import User

router = APIRouter(prefix="/api/microsoft", tags=["microsoft"])

# In-memory token store for guest users (no DB). Keyed by session stub.
_guest_tokens: dict = {}


@router.get("/auth")
def start_auth():
    """Redirect the browser to Microsoft login."""
    if not settings.MS_CLIENT_ID:
        raise HTTPException(
            status_code=503,
            detail="Microsoft Calendar not configured. Add MS_CLIENT_ID, MS_CLIENT_SECRET, MS_TENANT_ID to .env",
        )
    return RedirectResponse(get_auth_url())


@router.get("/callback")
async def oauth_callback(
    code: str = Query(...),
    db: Session = Depends(get_db),
    user=Depends(get_optional_user),
):
    """Exchange auth code for access token, persist it, redirect to frontend."""
    try:
        token_data = await exchange_code(code)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    access_token = token_data.get("access_token", "")

    if user:
        db.query(User).filter(User.id == user.id).update({"ms_access_token": access_token})
        db.commit()
    else:
        _guest_tokens["token"] = access_token

    return RedirectResponse(f"{settings.MS_FRONTEND_URL}/?ms_connected=true")


@router.get("/status")
def ms_status(user=Depends(get_optional_user)):
    configured = bool(settings.MS_CLIENT_ID)
    connected = bool((user and user.ms_access_token) or _guest_tokens.get("token"))
    return {"configured": configured, "connected": connected}


class SyncRequest(BaseModel):
    roadmap_data: dict
    interview_date: str = ""


@router.post("/sync")
async def sync_to_calendar(
    req: SyncRequest,
    db: Session = Depends(get_db),
    user=Depends(get_optional_user),
):
    """Push all roadmap tasks to Microsoft Calendar as events."""
    token = (user.ms_access_token if user else None) or _guest_tokens.get("token")
    if not token:
        raise HTTPException(
            status_code=401,
            detail="Not connected to Microsoft Calendar. Visit /api/microsoft/auth first.",
        )
    try:
        ids = await sync_roadmap(token, req.roadmap_data, req.interview_date)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))

    return {"message": f"Created {len(ids)} calendar events", "event_ids": ids}
