// import { GitHubRepo, PreInterviewBody } from "../utils/types"
// import axios from "axios"
// import { extractTextFromPdf } from "../utils/pdfParser";
// import { fetchUserRepos } from "../utils/githubUtils";
// import { Request, Response } from "express";
// import { prisma } from "../../db";


// const preInterview = async (req: Request, res: Response) => {
//     const { success, data} = PreInterviewBody.safeParse(req.body);

//     if (!success) {
//         res.status(411).json({
//             message: "Incorrect body"
//         });
//         return;
//     }

//     if (!req.file) {
//         res.status(400).json({
//             message: "Please upload your resume (PDF format)."
//         });
//         return;
//     }

//     const resumeText = await extractTextFromPdf(req.file.buffer);

//     //Without rate limiting 
//     // const githubUrl = data.github.endsWith("/") ? data.github.slice(0, -1) : data.github;
//     // const githubUsername = githubUrl.split("/").pop();
//     // //In future if this api.github.com hit rate limit which is 100/per sec then use dataImulse or Webshare for to send proxy req
//     // const userGitRepo = await axios.get(`https://api.github.com/users/${githubUsername}/repos`)
//     // const filteredUserRepo: GitHubRepo[] = userGitRepo.data.map(( repo: any) => ({
//     //     name: repo.name,
//     //     fullName: repo.full_Name,
//     //     desc: repo.description,
//     //     starCount: repo.stargazers_count
//     // }))

//     // With rate limiting logic 
//     const userGitRepos =  await fetchUserRepos(data.github); 
//     console.log("filtered Repos : ", userGitRepos);

//     try {
//         const interview = await prisma.interview.create({
//             data: {
//                 githubMetadata: userGitRepos,
//                 status: "Pre"
//             }
//         });
//     } catch (err: any) {
//         console.log("CODE:", err.code);
//         console.log("MESSAGE:", err.message);
//         console.log("META:", err.meta);
//     }


//     res.status(200).json({
//         message: "Candidate profile successfully integrated.",
//         data: {
//             // intId: interview,
//             githubRepos: userGitRepos,
//             resumeParsedText: resumeText.trim() 
//         }
//     });
// }


// export {
//     preInterview
// }







import { Request, Response } from "express";
import { PreInterviewBody } from "../utils/types";
import { extractTextFromPdf } from "../utils/pdfParser";
import { fetchUserRepos } from "../utils/githubUtils";
import { prisma } from "../db/db";

const preInterview = async (req: Request, res: Response) => {
    // 1. Validate request body
    const { success, data, error } = PreInterviewBody.safeParse(req.body);

    if (!success) {
        res.status(400).json({
            message: "Incorrect body",
            errors: error.flatten()
        });
        return;
    }

    // 2. Validate file upload
    if (!req.file) {
        res.status(400).json({
            message: "Please upload your resume (PDF format)."
        });
        return;
    }

    try {
        // 3. Extract resume text
        const resumeText = await extractTextFromPdf(req.file.buffer);

        // 4. Fetch GitHub repos (rate-limited internally via fetchUserRepos)
        const userGitRepos = await fetchUserRepos(data.github);
        console.log("Filtered repos:", userGitRepos);

        // 5. Persist interview record
        const interview = await prisma.interview.create({
            data: {
                githubMetadata: userGitRepos, // Json field — pass object directly, do NOT stringify
                status: "Pre"
            }
        });

        // 6. Respond
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