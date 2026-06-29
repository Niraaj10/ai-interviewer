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
        <Orb
            theme="bars"
            state={toOrbState(aiState)}
            volume={volume}
            size={140}
            aria-label={isAI ? "AI audio level" : "Microphone audio level"}
        />
    );
}

export default VoiceWaves;