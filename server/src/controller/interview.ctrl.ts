import { any } from "zod";
import { GitHubRepo, PreInterviewBody } from "../utils/types"
import axios from "axios"
import { extractTextFromPdf } from "../utils/pdfParser";
import { fetchUserRepos } from "../utils/githubUtils";


const preInterview = async (req, res) => {
    const { success, data} = PreInterviewBody.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: "Incorrect body"
        });
        return;
    }

    if (!req.file) {
        res.status(400).json({
            message: "Please upload your resume (PDF format)."
        });
        return;
    }

    const resumeText = await extractTextFromPdf(req.file.buffer);

    //Without rate limiting 
    // const githubUrl = data.github.endsWith("/") ? data.github.slice(0, -1) : data.github;
    // const githubUsername = githubUrl.split("/").pop();
    // //In future if this api.github.com hit rate limit which is 100/per sec then use dataImulse or Webshare for to send proxy req
    // const userGitRepo = await axios.get(`https://api.github.com/users/${githubUsername}/repos`)
    // const filteredUserRepo: GitHubRepo[] = userGitRepo.data.map(( repo: any) => ({
    //     name: repo.name,
    //     fullName: repo.full_Name,
    //     desc: repo.description,
    //     starCount: repo.stargazers_count
    // }))

    //With rate limiting logic 
    const userGitRepos =  await fetchUserRepos(data.github); 

    console.log("filtered Repos : ", userGitRepos);


    res.status(200).json({
        message: "Candidate profile successfully integrated.",
        data: {
            githubRepos: userGitRepos,
            resumeParsedText: resumeText.trim() 
        }
    });
}


export {
    preInterview
}