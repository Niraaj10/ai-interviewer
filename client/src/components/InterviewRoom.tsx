import { useState, useEffect } from "react";
import {
    LiveKitRoom,
    RoomAudioRenderer,
    AudioConference,
} from "@livekit/components-react";
import { useInterviewToken } from "../hooks/useInterviewToken";
import VoiceAssistantUI from "./UI/VoiceAssistantUI";

interface InterviewRoomProps {
    interviewId: string;
}

export default function InterviewRoom({ interviewId }: InterviewRoomProps) {
    const { connectionDetails, isLoading, error, fetchToken } = useInterviewToken();
    const [hasUserJoined, setHasUserJoined] = useState(false);

    useEffect(() => {
        if (interviewId && hasUserJoined) {
            fetchToken(interviewId);
        }
    }, [interviewId, fetchToken, hasUserJoined]);

    if (!hasUserJoined) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="max-w-md w-full rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Ready to Start Your Interview?</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Clicking below will establish a secure connection and activate your microphone.
                    </p>
                    <button
                        onClick={() => setHasUserJoined(true)}
                        className="w-full py-3 bg-white hover:bg-gray-200 text-black font-medium rounded-xl transition duration-200 shadow-lg"
                    >
                        Join Interview Room
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen ">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto"></div>
                    <p className="text-sm font-medium text-gray-400 mt-4 animate-pulse">
                        Configuring real-time media pipeline...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="p-6 max-w-sm rounded-xl shadow-md border border-red-900/40 text-center" role="alert">
                    <p className="text-red-400 font-semibold mb-2">Connection Blocked</p>
                    <p className="text-sm text-gray-400">{error}</p>
                    <button 
                        onClick={() => setHasUserJoined(false)}
                        className="mt-4 text-xs font-medium text-gray-400 underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!connectionDetails) return null;

    return (
        <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
            <LiveKitRoom
                token={connectionDetails.token}
                serverUrl={connectionDetails.serverUrl}
                connect={true}
                audio={{
                    echoCancellation: true,    
                    noiseSuppression: true,    
                    autoGainControl: true,    
                    channelCount: 1,           
                    sampleRate: 48000          
                }}
                video={false}
                onDisconnected={() => {
                    window.location.href = `/interview/${interviewId}/summary`;
                }}
            >
                <RoomAudioRenderer />
                
                <VoiceAssistantUI />

                {/* <div className="mt-8 max-w-md mx-auto p-2 flex justify-center">
                    <AudioConference />
                </div> */}
            </LiveKitRoom>
        </div>
    );
}