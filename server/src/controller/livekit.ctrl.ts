import { Request, Response } from "express";
import { prisma } from "../db/db";
import { buildParticipantId, buildRoomName, generateInterviewToken } from "../utils/liveKit";
import { LivekitTokenBody, LogMessageBody } from "../utils/types"
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";

const getInterviewToken = async (req: Request, res: Response) => {
    const { success, data, error } = LivekitTokenBody.safeParse(req.body);

    if(!success) {
        res.status(400).json({
            message: "Incorrect body"
        });
        return;
    }

    try {
        const interview = await prisma.interview.findUnique({
            where: { id: data.interviewId},
        })

        if (!interview) {
            res.status(404).json({
                message: "Interview not found"
            });
            return;
        }

        if (interview.status === "Done") {
            res.status(409).json({
                message: "This is interview has already been completed."
            });
            return;
        }

        const roomName = buildRoomName(interview.id);
        const participantId = buildParticipantId(interview.id);

        const token = await generateInterviewToken({
            roomName,
            participantId,
            participantName: "Candidate"
        });

        if (!interview.roomName) {
            await prisma.interview.update({
                where: { id: interview.id },
                data: {
                    roomName,
                    status: "InProgress"
                },
            })
        }

        res.status(200).json({
            message: "Token generated successfully.",
            data: {
                token,
                roomName,
                serverUrl: process.env.LIVEKIT_URL
            },
        });

    } catch (err: any) {
        console.error("getInterviewToken failed:", {
            message: err.message,
            code: err.code,
            meta: err.meta
        });

        res.status(500).json({
            message: "Failed to generate token."
        });
    }
}


const logMessage = asyncHandler(async (req: Request, res: Response) => {
    const result = LogMessageBody.safeParse(req.body);
    
    if (!result.success) {
        console.error("Zod Validation Failed:", result.error.format());
        throw new ApiError(400, "Incorrect request body layout mapping.");
    }

    const { interviewId, message, type } = result.data;

    const interview = await prisma.interview.findUnique({
        where: { id: interviewId }
    });

    if (!interview) {
        throw new ApiError(404, "Target interview session instance not found.");
    }

    const createdMessage = await prisma.message.create({
        data: {
            interviewId,
            message,
            type, // Must match "User" | "Assistant" precisely
        }
    });

    res.status(201).json({
        success: true,
        message: "Logged successfully.",
        data: { id: createdMessage.id }
    });
});



export { 
    logMessage,
    getInterviewToken,
}