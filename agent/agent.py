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

INTERVIEW_MODE = "both"  

BASE_INSTRUCTIONS = (
    "You are a calm, professional technical interviewer. Ask one question at a "
    "time. Listen carefully to their answer before asking a natural follow-up. "
    "Keep your responses concise — a sentence or two, not a monologue. "
    "Do not move to the next topic until the current one feels sufficiently explored.\n"
    "CRITICAL PROTOCOL:\n"
    "1. You conduct this interview strictly in English. Ignore any random or non-English audio artifacts.\n"
    "2. If you hear static, background room echo, ambient noise, or single words like 'Hello' during an ongoing topic, "
    "do not interrupt the user. Wait patiently until they finish speaking their entire point.\n"
    "3. Maintain a friendly but focused tone throughout."
)

def extractInterviewId(roomName: str) -> str:
    prefix = "interview-"
    if roomName.startswith(prefix):
        return roomName[len(prefix):]
    return roomName

# We removed the hardcoded instructions from the class so we can compute them dynamically per session
class interviewAgent(Agent):
    def __init__(self, dynamic_instructions: str) -> None:
        super().__init__(instructions=dynamic_instructions)

async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    interviewId = extractInterviewId(ctx.room.name)
    logger.info("Agent connected to room=%s. Target ID: %s", ctx.room.name, interviewId)

    resume_data = "No resume data provided."
    github_data = "No GitHub repositories linked."
    
    try:
        response = await backendClient._client.get(f"/api/v1/interview/{interviewId}")
        if response.status_code == 200:
            interview_record = response.json().get("data", {})
            
            resume_data = interview_record.get("resumeText", "No specific resume text attached.")
            github_data = str(interview_record.get("githubMetadata", "No GitHub repositories parsed."))
            logger.info("Successfully fetched candidate background context metrics from database.")
    except Exception as e:
        logger.warning("Could not fetch remote context variables, falling back to basic prompt: %s", e)

    dynamic_prompt = BASE_INSTRUCTIONS
    
    if INTERVIEW_MODE == "resume":
        dynamic_prompt += f"\n\n[FOCUS MODE: RESUME ONLY]\nEvaluate the candidate strictly using this Resume data. Do not ask about other projects:\n{resume_data}"
        logger.info("Interview Mode initialized: RESUME ONLY")
        
    elif INTERVIEW_MODE == "github":
        dynamic_prompt += f"\n\n[FOCUS MODE: GITHUB REPOS ONLY]\nEvaluate the candidate strictly using this array of parsed GitHub metadata. Ask deep questions about their structural design and tech stack:\n{github_data}"
        logger.info("Interview Mode initialized: GITHUB REPOSITORIES ONLY")
        
    else:  # "both"
        dynamic_prompt += (
            f"\n\n[FOCUS MODE: FULL COMPREHENSIVE]\nCross-examine the candidate by blending their Resume context and GitHub repository data:\n"
            f"--- Candidate Resume ---\n{resume_data}\n\n"
            f"--- Candidate GitHub Projects ---\n{github_data}"
        )
        logger.info("Interview Mode initialized: COMBINED COMPREHENSIVE")

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

    await session.start(
        room=ctx.room,
        agent=interviewAgent(dynamic_instructions=dynamic_prompt),
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    logger.info("Interview Agent session initialization lifecycle complete.")

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