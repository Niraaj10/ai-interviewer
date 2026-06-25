import z from "zod";

export const PreInterviewBody = z.object({
    github: z
            .string()
            .url("Github must be a valid URL")
            .refine((url) => url.includes("github.com"),{
                message: "URL must be a Github Profile URL"
            })
    
});

export const LivekitTokenBody = z.object({
    interviewId: z
                 .string()
                 .uuid("InterviewId must be a valid UUID"),
});

export const LogMessageBody = z.object({
    interviewId: z
                 .string()
                 .uuid("InterviewId must be a valid UUID"),
    message: z
             .string()
             .min(1, "message cannot be empty"),
    type: z
          .enum(["User", "Assistant"]),
});

export const GitHubRepoSchema = z.object({
    name: z.string(),
    fullName: z.string(),
    desc: z.string(),
    starCount: z.number()
});


export type GitHubRepo = z.infer<typeof GitHubRepoSchema>;