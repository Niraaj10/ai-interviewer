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
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Start Your Interview?</h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Clicking below will establish a secure connection and activate your microphone.
                    </p>
                    <button
                        onClick={() => setHasUserJoined(true)}
                        className="w-full py-3 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition duration-200 shadow-lg"
                    >
                        Join Interview Room
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto"></div>
                    <p className="text-sm font-medium text-gray-600 mt-4 animate-pulse">
                        Configuring real-time media pipeline...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
                <div className="p-6 max-w-sm bg-white rounded-xl shadow-md border border-red-100 text-center" role="alert">
                    <p className="text-red-600 font-semibold mb-2">Connection Blocked</p>
                    <p className="text-sm text-gray-500">{error}</p>
                    <button 
                        onClick={() => setHasUserJoined(false)}
                        className="mt-4 text-xs font-medium text-gray-600 underline"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!connectionDetails) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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

                <div className="mt-8 max-w-md mx-auto p-2 bg-gray-100 rounded-xl flex justify-center border border-gray-200">
                    <AudioConference />
                </div>
            </LiveKitRoom>
        </div>
    );
}