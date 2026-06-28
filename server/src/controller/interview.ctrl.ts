import { Request, Response } from "express";
import { PreInterviewBody } from "../utils/types";
import { extractTextFromPdf } from "../utils/pdfParser";
import { fetchUserRepos } from "../utils/githubUtils";
import { prisma } from "../db/db";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { success } from "zod";

const preInterview = asyncHandler( async (req: Request, res: Response) => {
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

        throw new ApiError(500, err?.message ||  "Something went wrong while processing the candidate profile.");
        // res.status(500).json({
        //     message: "Something went wrong while processing the candidate profile."
        // });
    }
});


const getInterviewContext = asyncHandler( async (req: Request, res: Response) => {

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
                },
            });
        
    } catch (err: any) {
        throw new ApiError(500, err?.message ||  "Something went wrong while fetching the interviewer's github and resume data");
    }

});

export { 
    preInterview,
    getInterviewContext, 
};