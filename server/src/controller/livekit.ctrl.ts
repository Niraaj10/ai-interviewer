import { Request, Response } from "express";
import { prisma } from "../db/db";
import { buildParticipantId, buildRoomName, generateInterviewToken } from "../utils/liveKit";
import { LivekitTokenBody, LogMessageBody } from "../utils/types"

export const getInterviewToken = async (req: Request, res: Response) => {
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

export const logMessage = async (req: Request, res: Response) => {
    const { success, data, error } = LogMessageBody.safeParse(req.body);

    if(!success) {
        res.status(400).json({
            message: "Incorrect body",
        });
        return;
    }

    try {
        const interview = await prisma.interview.findUnique({
            where: { id: data.interviewId }
        });

        if (!interview) {
            res.status(404).json({
                message: "Interview not found"
            });
            return;
        }

        const message = await prisma.message.create({
            data: {
                interviewId: data.interviewId,
                message: data.message,
                type: data.type,
            }
        });

        res.status(201).json({
            message: "Logged",
            data: {
                id: message.id
            }
        })

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