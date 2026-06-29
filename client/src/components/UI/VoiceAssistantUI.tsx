import {
    DisconnectButton,
    useConnectionState,
    useLocalParticipant,
    useVoiceAssistant,
    type TrackReference,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { VoiceWaves } from "./VoiceWaves";

export default function VoiceAssistantUI() {
    const { state, audioTrack } = useVoiceAssistant();
    const { localParticipant } = useLocalParticipant();
    const connectionState = useConnectionState();

    const micTrackPublication = localParticipant.getTrackPublication(Track.Source.Microphone);

    const isAISpeaking = state === "speaking" || state === "thinking";

    const micTrackRef: TrackReference | undefined = micTrackPublication
        ? {
              participant: localParticipant,
              source: Track.Source.Microphone,
              publication: micTrackPublication,
          }
        : undefined;

    const activeTrack: TrackReference | undefined = isAISpeaking ? audioTrack : micTrackRef;

    const getStatusText = () => {
        switch (state) {
            case "listening":
                return "Listening to you...";
            case "thinking":
                return "Processing response...";
            case "speaking":
                return "AI is speaking...";
            default:
                return "Ready - Speak when ready";
        }
    };

    if (connectionState === "connecting") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] bg-black">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                <p className="mt-4 text-gray-400 font-medium">Establishing audio bridge...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-black rounded-2xl shadow-xl border border-gray-800 text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                    Interview Active
                </span>
            </div>

            <h2 className="text-xl font-bold text-white mb-2">AI Technical Interviewer</h2>
            <p className="text-sm text-gray-400 mb-6">Your microphone is live. Speak naturally.</p>

            <div className="bg-gray-950 rounded-xl p-8 flex flex-col items-center justify-center min-h-[160px] mb-6 border border-gray-800">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                    {getStatusText()}
                </p>

                <div className="w-full flex items-center justify-center">
                    <VoiceWaves trackRef={activeTrack} isAI={isAISpeaking} aiState={state} />
                </div>
            </div>

            <div className="flex justify-center">
                <DisconnectButton className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm rounded-xl transition duration-200 shadow-md shadow-red-900/30">
                    End Interview Session
                </DisconnectButton>
            </div>
        </div>
    );
}