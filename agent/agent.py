import asyncio
import logging
import atexit

import config 
import backendClient
from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, RoomInputOptions, WorkerOptions
from livekit.plugins import google, noise_cancellation

logger = logging.getLogger("agent.main")
logging.basicConfig(level=logging.INFO)

INTERVIEWER_INSTRUCTIONS = (
    "You are a calm, professional technical interviewer. Ask one question at a "
    "time about the candidate's background, resume, and GitHub projects.\n"
    "CRITICAL PROTOCOL:\n"
    "1. You conduct this interview strictly in English. Ignore any random or non-English audio artifacts.\n"
    "2. If you hear static, background room echo, ambient noise, or single words like 'Hello' during an ongoing topic, "
    "do not interrupt the user. Wait patiently until they finish speaking their entire point.\n"
    "3. Maintain a professional, conversational tone. Keep your inputs brief."
)

def extractInterviewId(roomName: str) -> str:
    prefix = "interview-"
    if roomName.startswith(prefix):
        return roomName[len(prefix):]
    return roomName

class interviewAgent(Agent):
    def __init__(self) -> None:
        super().__init__(instructions=INTERVIEWER_INSTRUCTIONS)

async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    interviewId = extractInterviewId(ctx.room.name)
    logger.info("🤖 Agent connected to room=%s. Target ID: %s", ctx.room.name, interviewId)

    session = AgentSession(
        llm=google.beta.realtime.RealtimeModel(
            model="gemini-2.5-flash-native-audio-preview-12-2025",
            voice="Puck",
            temperature=0.7,
        ),
    )

    @session.on("conversationItemAdded")
    def onConversationItem(event) -> None:
        text_content = getattr(event.item, "textContent", None)
        role = getattr(event.item, "role", None)

        if not text_content or role != "assistant":
            return
    
        asyncio.create_task(
            backendClient.log_message(interviewId, text_content, role)
        )

    @session.on("userInputTranscribed")
    def onUserInputTranscribed(event) -> None:
        if not event.is_final or not event.transcript:
            return
        
        asyncio.create_task(
            backendClient.log_message(interviewId, event.transcript, "user")
        )

    # Launch the multi-modal orchestration engine inside the WebRTC room context
    await session.start(
        room=ctx.room,
        agent=interviewAgent(),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    logger.info("🚀 Interview Agent session initialization lifecycle complete.")

async def shutdown() -> None:
    logger.info("Stopping agent worker instance and freeing client connection pools...")
    await backendClient.close()

if __name__ == "__main__":
    atexit.register(lambda: asyncio.run(shutdown()))

    agents.cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint
        )
    )