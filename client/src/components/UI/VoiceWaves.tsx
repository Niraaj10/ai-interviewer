import { useTrackVolume, type TrackReference } from "@livekit/components-react";
import { useEffect, useState, useRef } from "react";

interface VoiceWavesProps {
  trackRef: TrackReference | undefined;
  isAI: boolean;
  aiState: string;
}

export function VoiceWaves({ trackRef, isAI, aiState }: VoiceWavesProps) {
  const rawVolume = useTrackVolume(trackRef);
  const [smoothScale, setSmoothScale] = useState<number>(1);
  const currentScaleRef = useRef<number>(1);

  useEffect(() => {
    let animationFrameId: number;

    const smoothAudioLoop = () => {
      // 1. Calculate the ideal target size based on active audio activity states
      let targetScale = 1;
      
      if (rawVolume > 0.015) {
        // Boost human/AI audio signals, cap maximum structural limits to preserve container dimensions
        targetScale = 1 + Math.min(rawVolume * 2.5, 1.4);
      } else if (aiState === "thinking") {
        // Rhythmic, gentle idle sine breath when compiling model context data
        targetScale = 1 + Math.sin(Date.now() * 0.004) * 0.12;
      } else if (aiState === "listening") {
        // Tiny structural vibrations to show the mic is actively waiting for speech signals
        targetScale = 1 + Math.sin(Date.now() * 0.02) * 0.02;
      }

      // 2. LINEAR INTERPOLATION (LERP): Smooths out raw audio spikes
      // Lower number (e.g., 0.1) = smoother and more fluid fluid movement
      // Higher number (e.g., 0.3) = faster, more erratic jumps
      const lerpValue = 0.15;
      const nextScale = currentScaleRef.current + (targetScale - currentScaleRef.current) * lerpValue;

      // 3. Update memory bounds and push layout configuration values to view state
      currentScaleRef.current = nextScale;
      setSmoothScale(nextScale);

      animationFrameId = requestAnimationFrame(smoothAudioLoop);
    };

    animationFrameId = requestAnimationFrame(smoothAudioLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [rawVolume, aiState]);

  // Handle dynamic border opacities depending on current application state triggers
  const getBorderOpacityClass = () => {
    if (aiState === "thinking") return "border-black/30";
    if (rawVolume > 0.015) return "border-black/60";
    return "border-black/10";
  };

  return (
    <div className="flex items-center justify-center h-48 w-full relative my-4">
      {/* Outer Halo ring (Mimics fluid orb echo effect seen in your image) */}
      <div
        className={`absolute rounded-full border border-dashed transition-all duration-100 ease-out ${getBorderOpacityClass()}`}
        style={{
          transform: `scale(${smoothScale * 1.25})`,
          width: "100px",
          height: "100px",
          opacity: rawVolume > 0.015 ? 0.4 : 0.15,
        }}
      />

      {/* Secondary Inner Shadow Halo Container */}
      <div
        className="absolute rounded-full border border-black/20 transition-all duration-150 ease-out"
        style={{
          transform: `scale(${smoothScale * 1.12})`,
          width: "100px",
          height: "100px",
        }}
      />

      {/* Core Central Minimalist Orb (Solid Matte Black) */}
      <div
        className={`rounded-full bg-black shadow-2xl transition-transform duration-75 ease-out flex items-center justify-center`}
        style={{
          transform: `scale(${smoothScale})`,
          width: "100px",
          height: "100px",
          boxShadow: rawVolume > 0.015 ? "0 20px 40px -5px rgba(0,0,0,0.3)" : "0 10px 20px -5px rgba(0,0,0,0.1)",
        }}
      >
        {/* Minimal Core Center Accent Ring */}
        <div className="w-4 h-4 rounded-full bg-white/20 animate-pulse" />
      </div>
    </div>
  );
}