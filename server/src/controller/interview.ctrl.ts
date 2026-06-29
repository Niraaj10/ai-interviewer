import { Request, Response } from "express";
import { PreInterviewBody } from "../utils/types";
import { extractTextFromPdf } from "../utils/pdfParser";
import { fetchUserRepos } from "../utils/githubUtils";
import { prisma } from "../db/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { InterviewStatus } from "../../generated/prisma";



const preInterview = asyncHandler(async (req: Request, res: Response) => {
    const { success, data, error } = PreInterviewBody.safeParse(req.body);

    if (!success) {
        throw new ApiError(400, "Incorrect body");

    }

    if (!req.file) {
        throw new ApiError(400, "Please upload your resume (PDF format).");
    }

    try {
        const resumeText = await extractTextFromPdf(req.file.buffer);

        const userGitRepos = await fetchUserRepos(data.github);
        // console.log("Filtered repos:", userGitRepos);

        const interview = await prisma.interview.create({
            data: {
                githubMetadata: userGitRepos,
                resumeText: resumeText,
                status: "Pre",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        return res.status(200).json({
            message: "Candidate profile successfully integrated.",
            data: {
                intId: interview.id,
                githubRepos: userGitRepos,
                resumeParsedText: resumeText.trim()
            }
        });
    } catch (err: any) {
        console.error("preInterview failed:", {
            message: err.message,
            code: err.code,
            meta: err.meta
        });

        throw new ApiError(500, err?.message || "Something went wrong while processing the candidate profile.");
        // res.status(500).json({
        //     message: "Something went wrong while processing the candidate profile."
        // });
    }
});


const getInterviewContext = asyncHandler(async (req: Request, res: Response) => {

    const { interviewId } = req.params as { interviewId: string };


    if (!interviewId) {
        throw new ApiError(400, "Please provide Interview Id")
    }

    try {

        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewId
            },
            select: {
                resumeText: true,
                githubMetadata: true,
                status: true,
                score: true,
                feedback: true,
            },
        })

        if (!interview) {
            throw new ApiError(404, `No interview record found matching Id: ${interviewId}`)
        }

        res
            .status(200)
            .json({
                success: true,
                data: {
                    resumeText: interview.resumeText || "No resume data attached to this profile.",
                    githubMetadata: interview.githubMetadata || [],
                    status: interview.status,
                    score: interview.score,
                    feedback: interview.feedback
                },
            });

    } catch (err: any) {
        throw new ApiError(500, err?.message || "Something went wrong while fetching the interviewer's github and resume data");
    }

});



const interviewFeedbackByAgent = asyncHandler(async (req: Request, res: Response) => {
    const { interviewId } = req.params as { interviewId: string };

    const { score, feedback } = req.body as { score: number; feedback: string };

    if (!interviewId) {
        throw new ApiError(400, "Please provide Interview Id")
    }

    if (!score || !feedback) {
        throw new ApiError(400, "Please provide Score and feedback")
    }

    try {

        const updatedInterview = await prisma.interview.update({
            where: { id: interviewId },
            data: {
                score: Number(score),
                feedback: feedback
            }
        });

        res.status(200).json({
            success: true,
            message: "Evaluation payload written successfully.",
            data: updatedInterview
        });

    } catch (err: any) {
        throw new ApiError(500, err?.message || "Something went wrong while updating interview score and feedback");
    }
});



const saveInterviewEvaluation = asyncHandler(async (req: Request, res: Response) => {
    const { interviewId } = req.params as { interviewId: string };
    const { score, feedback } = req.body as { score: number; feedback: string };

    if (score === undefined || !feedback) {
        throw new ApiError(400, "Incomplete evaluation dataset payload provided.");
    }

    const updatedInterview = await prisma.interview.update({
        where: {
            id: interviewId
        },
        data: {
            score: Number(score),
            feedback: feedback,
            status: InterviewStatus.Done 
        }
    });

    res.status(200).json({
        success: true,
        message: "Performance scorecard successfully persistent in system logs.",
        data: updatedInterview
    });

})




const getInterviewResult = asyncHandler(async (req: Request, res: Response) => {
    const { interviewId } = req.params as { interviewId: string };

    if (!interviewId) {
        throw new ApiError(400, "Please provide an Interview ID parameter.");
    }

    try {

        const interview = await prisma.interview.findUnique({
            where: {
                id: interviewId
            },
            select: {
                id: true,
                status: true,
                score: true,
                feedback: true,
                createdAt: true
            }
        });

        if (!interview) {
            throw new ApiError(404, `No interview profile matches the given identifier: ${interviewId}`);
        }

        res.status(200).json({
            success: true,
            message: "Interview scorecard metrics fetched successfully.",
            data: {
                interviewId: interview.id,
                status: interview.status,
                score: interview.score ?? 0, 
                feedback: interview.feedback || "Evaluation processing is still underway. Refresh shortly.",
                completedAt: interview.createdAt
            }
        });

    } catch (err: any) {
        throw new ApiError(500, err?.message || "Something went wrong while getting interview score and feedback");
    }
});

export {
    preInterview,
    getInterviewContext,
    interviewFeedbackByAgent,
    saveInterviewEvaluation,
    getInterviewResult,
};