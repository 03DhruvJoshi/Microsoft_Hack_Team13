"""Audio/video transcription via Whisper using the same Azure OpenAI endpoint as chat."""
import io
import asyncio
from functools import partial

from openai import AzureOpenAI
from config import settings

_client = AzureOpenAI(
    api_version=settings.AZURE_OPENAI_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
    api_key=settings.AZURE_OPENAI_KEY,
)


def _transcribe_sync(audio_bytes: bytes, filename: str) -> str:
    buf = io.BytesIO(audio_bytes)
    buf.name = filename  # SDK uses the extension to pick the decoder

    result = _client.audio.transcriptions.create(
        model="whisper-1",
        file=buf,
        response_format="text",
    )
    return result if isinstance(result, str) else result.text


async def transcribe(audio_bytes: bytes, filename: str) -> str:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(_transcribe_sync, audio_bytes, filename))
