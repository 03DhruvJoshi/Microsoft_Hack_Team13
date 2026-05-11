from fastapi import APIRouter, HTTPException, UploadFile, File

from services.whisper_service import transcribe

router = APIRouter(prefix="/api", tags=["transcription"])

_MAX_BYTES = 25 * 1024 * 1024  # 25 MB — Whisper API limit

# All MIME types accepted by OpenAI Whisper
_ALLOWED = {
    "audio/webm", "audio/mp3", "audio/mpeg", "audio/mp4", "audio/wav",
    "audio/ogg", "audio/flac", "audio/x-m4a", "audio/m4a",
    "video/webm", "video/mp4", "video/mpeg",
    "application/octet-stream",  # browsers sometimes send this for blobs
}


@router.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """Transcribe an audio or video recording using Whisper and return plain text."""
    ct = file.content_type or ""
    base_ct = ct.split(";")[0].strip()  # strip codec params, e.g. "audio/webm;codecs=opus" → "audio/webm"
    if ct and base_ct not in _ALLOWED:
        raise HTTPException(status_code=400, detail=f"Unsupported type: {ct}")

    data = await file.read()
    if not data:
        raise HTTPException(status_code=400, detail="Empty file")
    if len(data) > _MAX_BYTES:
        raise HTTPException(status_code=413, detail="File exceeds 25 MB limit")

    try:
        text = await transcribe(data, file.filename or "recording.webm")
        return {"text": text}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Transcription failed: {exc}")
