import { Router } from "express";
import { getInterviewToken, logMessage } from "../controller/livekit.ctrl";
import { tokenEndpointRateLimiter } from "../middleware/rateLimiter";
import { interalServiceAuth } from "../middleware/internalAuth";
import { getInterviewContext, getInterviewResult, saveInterviewEvaluation } from "../controller/interview.ctrl";

const router = Router();

router.get("/:interviewId", getInterviewContext);

router.get("/:interviewId", getInterviewResult);

router.post("/token", tokenEndpointRateLimiter, getInterviewToken);

router.post("/:interviewId/evaluate-session", saveInterviewEvaluation);


// Internal endpoint called only by the Python agent worker, never the browser.
router.post("/log-message", interalServiceAuth, logMessage);

export default router;