import { Request, Response } from "express";
import { PreInterviewBody } from "../utils/types";
import { extractTextFromPdf } from "../utils/pdfParser";
import { fetchUserRepos } from "../utils/githubUtils";
import { prisma } from "../db/db";

const preInterview = async (req: Request, res: Response) => {
    const { success, data, error } = PreInterviewBody.safeParse(req.body);

    if (!success) {
        res.status(400).json({
            message: "Incorrect body",
        });
        return;
    }

    if (!req.file) {
        res.status(400).json({
            message: "Please upload your resume (PDF format)."
        });
        return;
    }

    try {
        const resumeText = await extractTextFromPdf(req.file.buffer);

        const userGitRepos = await fetchUserRepos(data.github);
        // console.log("Filtered repos:", userGitRepos);

        const interview = await prisma.interview.create({
            data: {
                githubMetadata: userGitRepos, 
                status: "Pre",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        res.status(200).json({
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

        res.status(500).json({
            message: "Something went wrong while processing the candidate profile."
        });
    }
};

export { preInterview };