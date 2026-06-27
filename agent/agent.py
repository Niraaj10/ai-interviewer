import asyncio
import logging

import config 
import backendClient
from livekit import agents
from livekit.agents import Agent, AgentSession, JobContext, RoomInputOptions, WorkerOptions
from livekit.plugins import google, noise_cancellation

logger = logging.getLogger("agent.main")
logging.basicConfig(level=logging.INFO)

INTERVIEWER_INSTRUCTIONS = (
    "You are a calm, professional technical interviewer. Ask one question at a "
    "time about the candidate's background, resume, and GitHub projects. "
    "Listen carefully to their answer before asking a natural follow-up. "
    "Keep your responses concise — a sentence or two, not a monologue. "
    "Do not move to the next topic until the current one feels sufficiently "
    "explored. Maintain a friendly but focused tone throughout."
)

def extractInterviewId(roomName: str) -> str:
    """
    Recovers the clear-text UUID v4 string from the standard room identity prefix.
    """
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
    logger.info("Agent joined room=%s interviewId=%s", ctx.room.name, interviewId)

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

    # 5. Ignite the agent listening loop
    await session.start(
        room=ctx.room,
        agent=interviewAgent(),
        room_input_options=RoomInputOptions(  
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )

async def shutdown() -> None:
    await backendClient.close()

if __name__ == "__main__":
    agents.cli.run_app(
        WorkerOptions(
            entrypoint_fnc=entrypoint,
            shutdown_fnc=shutdown
        )
    )