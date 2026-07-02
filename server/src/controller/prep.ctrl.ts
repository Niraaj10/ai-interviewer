import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { StudyRoadmapBody, SuggestQuestionsBody } from "../utils/types";
import { extractTextFromPdf } from "../utils/pdfParser";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });


export const suggestQuestions = asyncHandler(
    async (req: Request, res: Response) => {
        const { success, data, error } = SuggestQuestionsBody.safeParse(req.body);

        if (!success) {
            throw new ApiError(400, "Incorrect body");
        }

        if (!req.file) {
            throw new ApiError(400, "Please upload your resume (PDF format).");
        }

        try {
            const resumeText = await extractTextFromPdf(req.file.buffer);
            const { jobDescription } = data;

            const prompt = `
            You are a senior technical interviewer preparing for a real interview.

            Given the candidate's resume and the job description below, generate exactly 12 interview questions that:
            - Are highly specific to the candidate's actual experience and the JD requirements
            - Cover a mix of technical depth, system design, and behavioural fit
            - A real interviewer would very likely ask in a panel interview for this exact role
            - Are ordered from warm-up → core technical → advanced / system design → behavioural

            Return ONLY a valid JSON array of strings. No preamble, no markdown, no explanation.
            Example format: ["Question 1?", "Question 2?", ...]

            RESUME:
            ${resumeText}

            JOB DESCRIPTION:
            ${jobDescription}
            `.trim();

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: prompt }] }],
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: SchemaType.ARRAY,
                        description: "List of exactly 12 tailored interview questions.",
                        items: { type: SchemaType.STRING }
                    }
                }
            });

            const questions = JSON.parse(result.response.text()) as string[];

            return res.status(200).json({
                success: true,
                message: "Questions generated successfully",
                data: { 
                    questions,
                    resumeText
                }
            });


        } catch (err: any) {
            console.error("suggestQuestions failed:", {
                message: err.message,
                code: err.code
            });
            throw new ApiError(500, err?.message || "Failed to parse profile or generate interview questions.");
        }
    }
);


export const studyRoadmap = asyncHandler(
    async (req: Request, res: Response) => {
        const { success, data, error } = StudyRoadmapBody.safeParse(req.body);

        if (!success) {
            throw new ApiError(400, "Incorrect request body");
        }

        if (!req.file) {
            throw new ApiError(400, "Please upload your resume (PDF format).");
        }

        try {
            const { jobDescription, transcript } = data;

            const resumeText = await extractTextFromPdf(req.file.buffer);
            const hasTranscript = transcript && transcript.trim().length > 0;

            const prompt = `
            You are a senior engineering mentor creating a personalised study roadmap.

            ${hasTranscript
                    ? `You have the candidate's resume, the target job description, AND the full transcript of their mock interview. Use all three to identify gaps — both from the resume vs. JD comparison AND from how the candidate actually answered during the interview.`
                    : `You have the candidate's resume and the target job description. Identify skill gaps by comparing what the candidate has against what the role requires.`
                }

            Return ONLY a valid JSON object with this exact shape — no markdown, no extra keys:
            {
            "summary": "2-3 sentence overview of the candidate's readiness and main gaps",
            "gaps": [
                { "area": "Topic name", "reason": "Why this is a gap", "priority": "high | medium | low" }
            ],
            "roadmap": [
                {
                "week": 1,
                "focus": "Short focus label",
                "topics": ["Topic A", "Topic B"],
                "resources": ["Resource name or URL"]
                }
            ]
            }

            Keep roadmap to 4 weeks max. Be specific — name actual technologies, concepts, and resources.

            RESUME:
            ${resumeText}

            JOB DESCRIPTION:
            ${jobDescription}
            ${hasTranscript ? `\nINTERVIEW TRANSCRIPT:\n${transcript}` : ""}
            `.trim();

            const result = await model.generateContent(prompt);
            const raw = result.response.text().trim();
            const cleaned = raw.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

            let roadmap: object;

            try {
                roadmap = JSON.parse(cleaned);
            } catch {
                throw new ApiError(500, "AI returned malformed response — please retry");
            }
            
            return res.status(200).json({
                message: "Study roadmap generated successfully",
                data: {
                    roadmap: roadmap
                }
            });

        } catch (err: any) {
            console.error("studyRoadmap failed:", {
                message: err.message,
                code: err.code
            });
            throw new ApiError(500, err?.message || "Failed to generate study roadmap.");
        }

    }
);