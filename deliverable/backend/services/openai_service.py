import json
import asyncio
from functools import partial

from openai import AzureOpenAI
from config import settings

_client = AzureOpenAI(
    api_version=settings.AZURE_OPENAI_VERSION,
    azure_endpoint=settings.AZURE_OPENAI_ENDPOINT,
    api_key=settings.AZURE_OPENAI_KEY,
)


def _chat_sync(system: str, user: str, max_tokens: int = 2000) -> dict:
    response = _client.chat.completions.create(
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        max_completion_tokens=max_tokens,
        model=settings.AZURE_OPENAI_MODEL,
    )
    text = response.choices[0].message.content.strip()
    if text.startswith("```"):
        text = text.split("```")[1]
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


async def chat(system: str, user: str, max_tokens: int = 2000) -> dict:
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, partial(_chat_sync, system, user, max_tokens))
