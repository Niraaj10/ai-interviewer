import {
    LiveKitRoom,
    RoomAudioRenderer,
    useVoiceAssistant,
    BarVisualizer,
    DisconnectButton,
} from "@livekit/components-react";
import { useInterviewToken } from "../hooks/useInterviewToken";
import { useEffect } from "react";
import VoiceAssistantUI from "./UI/VoiceAssistantUI";

interface InterviewRoomProps {
    interviewId: string
}




export default function InterviewRoom({ interviewId }: InterviewRoomProps) {
    const { connectionDetails, isLoading, error, fetchToken } = useInterviewToken();

    useEffect(() => {
        fetchToken(interviewId);
    }, [interviewId, fetchToken]);

    if (isLoading) {
        return <p>Connection to your interview...</p>
    }

    if (error) {
        return <p role="alert">Couldn't start the interview: {error}</p>
    }

    if (!connectionDetails) {
        return null;
    }

    return (
        <LiveKitRoom
            token={connectionDetails.token}
            serverUrl={connectionDetails.serverUrl}
            connect
            audio
            video={false}
            onDisconnected={() => {
                return <>
                    <p>Thanks for completing interview</p>
                </>
            }}
        >
            <RoomAudioRenderer />
            <VoiceAssistantUI />
        </LiveKitRoom>
    )
}