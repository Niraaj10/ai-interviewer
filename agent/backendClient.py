import logging
import httpx
from config import BACKEND_BASE_URL, INTERNAL_SERVICE_SECRET

logger = logging.getLogger("agent.backendClient")

_client = httpx.AsyncClient(
    base_url=BACKEND_BASE_URL,
    timeout=5.0,
    headers={"x-internal-service-secret": INTERNAL_SERVICE_SECRET},
)


async def log_message(interviewId: str, message: str, role: str) -> None:
    """
    Persists a single transcript run.

    role must be "User" or "Assistant" to match the MessageType enum in schema.prisma. Failures are ligged but not raised a transcript-logging hiccup should never crash the live voice session.
    """

    messageType = "User" if role == "user" else "Assistant"

    try: 
        response = await _client.post(
            "/api/v1/interview/log-message",
            json={
                "interviewId": interviewId,
                "message": message,
                "type": messageType
            },
        )
        response.raise_for_status()

    except httpx.HTTPError as exc:
        logger.warning("Failed to log message for interview %s: %s", interviewId, exc)

async def close() -> None:
    await _client.aclose()

