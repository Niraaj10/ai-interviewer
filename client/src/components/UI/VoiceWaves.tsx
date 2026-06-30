import { useTrackVolume, type TrackReference } from "@livekit/components-react";
import { Orb, type OrbState } from "orb-ui";

interface VoiceWavesProps {
    trackRef: TrackReference | undefined;
    isAI: boolean;
    aiState: string;
}


function toOrbState(aiState: string): OrbState {
    switch (aiState) {
        case "listening":
        case "thinking":
            return "listening";
        case "speaking":
            return "speaking";
        case "connecting":
            return "connecting";
        case "error":
            return "error";
        default:
            return "idle";
    }
}

export function VoiceWaves({ trackRef, isAI, aiState }: VoiceWavesProps) {
    const volume = useTrackVolume(trackRef);

    return (
        <div>
            {/* <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
                {toOrbState(aiState)}
            </p> */}
            <span className="bg-[#F4D03F] p-2 leading-tight rotate-[12deg] text-xs font-bold uppercase tracking-widest mb-6">
                {toOrbState(aiState)}
            </span>

            <div className="mt-20">
                <Orb
                    theme="bars"
                    state={toOrbState(aiState)}
                    volume={volume}
                    size={250}
                    aria-label={isAI ? "AI audio level" : "Microphone audio level"}
                    className="red-orb"
                />
            </div>
        </div>
    );
}

export default VoiceWaves;