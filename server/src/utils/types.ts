import z from "zod";

export const PreInterviewBody = z.object({
    github: z.string()
})

export const GitHubRepoSchema = z.object({
    name: z.string(),
    fullName: z.string(),
    desc: z.string(),
    starCount: z.number()
});


export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;