import asyncio
import logging
import atexit

import config
import backendClient
from pydantic import BaseModel, Field
from livekit import agents
from livekit.agents import Agent, AgentSession, ChatContext, JobContext, RoomInputOptions, WorkerOptions
from livekit.plugins import google, noise_cancellation

logger = logging.getLogger("agent.main")
logging.basicConfig(level=logging.INFO)

INTERVIEW_MODE = "both"

BASE_INSTRUCTIONS = (
    "You are a calm, professional technical interviewer. Ask one question at a time. "
    "Listen carefully to their answer before asking a natural follow-up. "
    "Keep your responses concise — a sentence or two, not a monologue.\n"
    "CRITICAL PROTOCOL:\n"
    "1. You conduct this interview strictly in English. Ignore any random or non-English audio artifacts.\n"
    "2. If you hear static, background room echo, ambient noise, or single words like 'Hello' during an ongoing topic, "
    "do not interrupt the user. Wait patiently until they finish speaking their entire point.\n"
    "3. Maintain a professional, conversational tone. Keep your inputs brief."
)


class InterviewEvaluation(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall interview score out of 100")
    feedback: str = Field(..., description="Detailed feedback summarizing strengths and areas to improve")


def extractInterviewId(roomName: str) -> str:
    prefix = "interview-"
    if roomName.startswith(prefix):
        return roomName[len(prefix):]
    return roomName


class interviewAgent(Agent):
    def __init__(self, dynamic_instructions: str) -> None:
        super().__init__(instructions=dynamic_instructions)


async def entrypoint(ctx: JobContext) -> None:
    await ctx.connect()
    interviewId = extractInterviewId(ctx.room.name)
    logger.info("🤖 Agent connected to room=%s. Target ID: %s", ctx.room.name, interviewId)

    resume_data = "No resume data provided."
    github_data = "No GitHub repositories linked."

    try:
        response = await backendClient._client.get(f"/api/v1/interview/{interviewId}")
        if response.status_code == 200:
            interview_record = response.json().get("data", {})
            resume_data = interview_record.get("resumeText", "")
            github_data = str(interview_record.get("githubMetadata", ""))
    except Exception as e:
        logger.warning("Could not fetch database context parameters: %s", e)

    dynamic_prompt = BASE_INSTRUCTIONS
    if INTERVIEW_MODE == "resume":
        dynamic_prompt += f"\n\n[RESUME ONLY]\n{resume_data}"
    elif INTERVIEW_MODE == "github":
        dynamic_prompt += f"\n\n[GITHUB REPOS ONLY]\n{github_data}"
    else:
        dynamic_prompt += f"\n\n[COMPREHENSIVE]\nResume:\n{resume_data}\n\nGitHub:\n{github_data}"

   
    voice_model = google.beta.realtime.RealtimeModel(
        model="gemini-2.5-flash-native-audio-preview-12-2025",
        voice="Puck",
        temperature=0.7,
    )

    eval_model = google.LLM(model="gemini-2.5-flash")


    interview_agent = interviewAgent(dynamic_instructions=dynamic_prompt)

    session = AgentSession(llm=voice_model)


    @session.on("conversation_item_added")
    def onConversationItem(event) -> None:
        text_content = getattr(event.item, "text_content", None)
        role = getattr(event.item, "role", None)

        if not text_content or role not in ("assistant", "user"):
            return

        asyncio.create_task(
            backendClient.log_message(interviewId, text_content, role)
        )

    @session.on("close")
    def on_session_close(event) -> None:
        logger.info("🏁 Session close signal captured. Running background generation scoring protocol...")

        async def generate_final_report():
            try:
                history = interview_agent.chat_ctx.messages()
                if not history:
                    logger.warning("No chat history found for interview %s; skipping evaluation.", interviewId)
                    return

                formatted_transcript = "\n".join(
                    f"{'AI Interviewer' if msg.role == 'assistant' else 'Candidate'}: {msg.text_content or ''}"
                    for msg in history
                )

                eval_chat_ctx = ChatContext.empty()
                eval_chat_ctx.add_message(
                    role="system",
                    content=(
                        "You are a rigorous technical interview evaluator. Analyze the "
                        "transcript and produce a fair score and detailed feedback."
                    ),
                )
                eval_chat_ctx.add_message(
                    role="user",
                    content=f"Analyze this technical interview transcript carefully:\n\n{formatted_transcript}",
                )

                result = await eval_model.chat(
                    chat_ctx=eval_chat_ctx,
                    response_format=InterviewEvaluation,
                ).collect()

                evaluation = InterviewEvaluation.model_validate_json(result.text)

                update_payload = {
                    "score": evaluation.score,
                    "feedback": evaluation.feedback,
                }

                await backendClient._client.post(
                    f"/api/v1/interview/{interviewId}/evaluate-session",
                    json=update_payload,
                )
                logger.info("Feedback assessment successfully populated and pushed to DB records.")
            except Exception as ex:
                logger.error("Evaluation compilation sequence failed: %s", ex)

        asyncio.create_task(generate_final_report())

    await session.start(
        room=ctx.room,
        agent=interview_agent,
        room_input_options=RoomInputOptions(
            noise_cancellation=noise_cancellation.BVC(),
        ),
    )
    logger.info("Interview Agent session initialization lifecycle complete.")


async def shutdown() -> None:
    await backendClient.close()


if __name__ == "__main__":
    atexit.register(lambda: asyncio.run(shutdown()))
    agents.cli.run_app(WorkerOptions(entrypoint_fnc=entrypoint))