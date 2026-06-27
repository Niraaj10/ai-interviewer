import { AccessToken } from "livekit-server-sdk";

const LK_API_KEY = process.env.LIVEKIT_API_KEY!;
const LK_API_SECRET = process.env.LIVEKIT_API_SECRET!;

interface GenerateInterviewTokenParams {
    roomName: string;
    participantId: string;
    participantName?: string;
}

export async function generateInterviewToken(
    params: GenerateInterviewTokenParams
): Promise<string> {
    const atoken = new AccessToken(LK_API_KEY, LK_API_SECRET, {
        identity: params.participantId,
        name: params.participantName,
        ttl: "15m",
    });

    atoken.addGrant({
        roomJoin: true,
        room: params.roomName,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true,
      });

    return await atoken.toJwt();

}


export function buildRoomName(interviewId: string): string {
    return `interview-${interviewId}`;
}

export function buildParticipantId(interviewId: string): string {
    return `interview-${interviewId}`
}