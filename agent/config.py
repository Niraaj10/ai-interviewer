import os
import sys

from dotenv import load_dotenv

load_dotenv()

REQUIRED_ENV_VARS = [
    "LIVEKIT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "GOOGLE_API_KEY",
    "BACKEND_BASE_URL",
    "INTERNAL_SERVICE_SECRET",
]


def validate_env() -> None:
    missing = [key for key in REQUIRED_ENV_VARS if not os.environ.get(key)]
    if missing:
        print(
            f"Missing required environment variables: {', '.join(missing)}. "
            f"Check your .env file against .env.example.",
            file=sys.stderr,
        )
        sys.exit(1)


validate_env()

LIVEKIT_URL = os.environ["LIVEKIT_URL"]
LIVEKIT_API_KEY = os.environ["LIVEKIT_API_KEY"]
LIVEKIT_API_SECRET = os.environ["LIVEKIT_API_SECRET"]
GOOGLE_API_KEY = os.environ["GOOGLE_API_KEY"]
BACKEND_BASE_URL = os.environ["BACKEND_BASE_URL"]
INTERNAL_SERVICE_SECRET = os.environ["INTERNAL_SERVICE_SECRET"]
