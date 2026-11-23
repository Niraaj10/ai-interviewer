import { useState, useEffect } from "react"
import {
  DisconnectButton,
  useConnectionState,
  useLocalParticipant,
  useTrackVolume,
  useVoiceAssistant,
  type TrackReference,
} from "@livekit/components-react"
import { Track } from "livekit-client"

const VOICE_UI_CSS = `
.viv-va{
  --viv-bg:#f8f5f0;
  --viv-ink:#100d0b;
  --viv-mute:#5c5852;
  --viv-faint:#87827a;
  --viv-card:#ffffff;
  --viv-card-ink:#151413;
  --viv-card-mute:#68645e;
  --viv-card-line:rgba(16,13,11,.09);
  --viv-card-soft:#f5f2ec;
  --viv-accent:#d9480f;
  --viv-agent:#0f7c6e;
  --viv-serif:"Instrument Serif","Newsreader","Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
  --viv-sans:"Inter","Inter Variable",ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
  --viv-mono:"JetBrains Mono","SF Mono",ui-monospace,Menlo,Consolas,monospace;
  --viv-ease:cubic-bezier(.22,1,.36,1);
  width:100%;
  display:flex;
  justify-content:center;
  align-items:center;
  font-family:var(--viv-sans);
  -webkit-font-smoothing:antialiased;
}
.viv-va *,.viv-va *::before,.viv-va *::after{box-sizing:border-box}

.viv-va-card{
  position:relative;
  width:100%;
  max-width:450px;
  background:var(--viv-card);
  color:var(--viv-card-ink);
  border-radius:18px;
  box-shadow:0 40px 90px -28px rgba(0,0,0,.68),0 0 0 1px rgba(0,0,0,.06);
  overflow:hidden;
  animation:viv-va-pop .55s var(--viv-ease) both;
}

/* Card Header */
.viv-va-head{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  height:54px;
  padding:0 18px;
  border-bottom:1px solid var(--viv-card-line);
}
.viv-va-head-left{
  display:inline-flex;
  align-items:center;
  gap:10px;
}
.viv-va-orb{
  width:22px;
  height:22px;
  border-radius:50%;
  flex:none;
  background:radial-gradient(circle at 32% 30%,#fff 0 8%,transparent 30%),conic-gradient(from 210deg,#ff9a76,#f6c1ff,#8ab4ff,#9ff0d5,#ffd38a,#ff9a76);
  animation:viv-va-spin 9s linear infinite;
}
.viv-va-orb.is-speaking{
  animation:viv-va-spin 3.5s linear infinite,viv-va-breathe 1.6s ease-in-out infinite;
}
.viv-va-title{
  font-size:13.5px;
  font-weight:600;
  letter-spacing:-.01em;
  color:var(--viv-card-ink);
}
.viv-va-timer{
  display:inline-flex;
  align-items:center;
  gap:7px;
  height:26px;
  padding:0 10px;
  border-radius:999px;
  background:var(--viv-card-soft);
  font:500 11px/1 var(--viv-mono);
  color:var(--viv-card-ink);
  font-variant-numeric:tabular-nums;
}
.viv-va-rec-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#16a34a;
  box-shadow:0 0 0 3px rgba(22,163,74,.2);
  animation:viv-va-pulse 2s ease-in-out infinite;
}

/* Card Body */
.viv-va-body{
  padding:24px 22px 22px;
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
}

/* Status Pill */
.viv-va-pill-tag{
  display:inline-flex;
  align-items:center;
  gap:8px;
  height:28px;
  padding:0 13px;
  border-radius:999px;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.06em;
  text-transform:uppercase;
  color:var(--viv-card-ink);
  transition:background-color .25s,color .25s;
}
.viv-va-pill-tag[data-speaker="ai"]{
  background:color-mix(in oklab,var(--viv-agent) 11%,var(--viv-card));
  color:var(--viv-agent);
}
.viv-va-pill-tag[data-speaker="user"]{
  background:color-mix(in oklab,var(--viv-accent) 10%,var(--viv-card));
  color:var(--viv-accent);
}
.viv-va-pill-dot{
  position:relative;
  width:7px;
  height:7px;
  border-radius:50%;
  background:currentColor;
}
.viv-va-pill-dot::after{
  content:"";
  position:absolute;
  inset:-4px;
  border-radius:50%;
  border:1px solid currentColor;
  animation:viv-va-ping 2.2s var(--viv-ease) infinite;
}

/* Heading */
.viv-va-heading{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:34px;
  line-height:1.08;
  letter-spacing:-.025em;
  color:var(--viv-card-ink);
  margin:16px 0 6px;
}
.viv-va-heading em{
  font-style:italic;
  color:var(--viv-accent);
}
.viv-va-sub{
  font-size:13px;
  color:var(--viv-card-mute);
  line-height:1.55;
  max-width:34ch;
  margin:0 0 20px;
}

/* Dark Studio Waveform Stage (Matches Home Page Call Player) */
.viv-va-stage{
  position:relative;
  width:100%;
  border-radius:14px;
  background:#100d0b;
  color:#f5f2ec;
  padding:16px 18px 15px;
  display:flex;
  flex-direction:column;
  gap:14px;
  margin-bottom:20px;
  box-shadow:0 20px 44px -22px rgba(16,13,11,.65),inset 0 0 0 1px rgba(255,255,255,.08);
}
.viv-va-stage-top{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.05em;
  text-transform:uppercase;
  color:rgba(245,242,236,.62);
}
.viv-va-turn{
  display:inline-flex;
  align-items:center;
  gap:7px;
  color:#f5f2ec;
}
.viv-va-turn i{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#2dd4bf;
  box-shadow:0 0 0 3px rgba(45,212,191,.22);
}
.viv-va-turn[data-user="true"] i{
  background:#f97316;
  box-shadow:0 0 0 3px rgba(249,115,22,.22);
}
.viv-va-bars{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  height:52px;
  padding:0 2px;
}
.viv-va-bars i{
  width:3px;
  height:100%;
  border-radius:3px;
  background:rgba(245,242,236,.28);
  transform-origin:50% 50%;
  transition:transform .09s ease-out,background-color .25s ease;
}
.viv-va-bars[data-speaker="ai"] i{
  background:color-mix(in oklab,#0f7c6e 55%,#ffffff);
}
.viv-va-bars[data-speaker="user"] i{
  background:color-mix(in oklab,#d9480f 65%,#ffffff);
}
.viv-va-bars[data-speaker="thinking"] i{
  background:rgba(245,242,236,.45);
}
.viv-va-stage-foot{
  display:flex;
  align-items:center;
  justify-content:space-between;
  width:100%;
  padding-top:10px;
  border-top:1px solid rgba(255,255,255,.09);
  font:500 10px/1 var(--viv-mono);
  letter-spacing:.06em;
  text-transform:uppercase;
  color:rgba(245,242,236,.5);
}

/* Controls Row */
.viv-va-actions{
  width:100%;
  display:flex;
  align-items:center;
  gap:10px;
}
.viv-va-mute{
  height:44px;
  padding:0 15px;
  border-radius:999px;
  border:0;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  color:var(--viv-card-ink);
  font-size:13px;
  font-weight:500;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  cursor:pointer;
  flex:none;
  transition:background-color .2s,color .2s,transform .18s var(--viv-ease);
}
.viv-va-mute:hover{background:#ebe6dc}
.viv-va-mute[aria-pressed="true"]{
  background:color-mix(in oklab,var(--viv-accent) 12%,var(--viv-card));
  color:var(--viv-accent);
  box-shadow:inset 0 0 0 1px color-mix(in oklab,var(--viv-accent) 30%,transparent);
}

/* End Session Pill Button (Matches Home & Form Pill) */
.viv-va-end{
  position:relative;
  flex:1;
  height:44px;
  padding:0 20px;
  border-radius:999px;
  border:0;
  background:var(--viv-ink);
  color:var(--viv-bg);
  font-size:13.5px;
  font-weight:500;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  cursor:pointer;
  overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 10px 24px -10px rgba(16,13,11,.55);
  transition:background-color .25s,transform .2s var(--viv-ease);
}
.viv-va-end:hover{
  background:var(--viv-accent);
  color:#fff;
}
.viv-va-end:active{transform:scale(.988)}

/* Connecting State */
.viv-va-connecting{
  padding:28px 12px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:12px;
}
.viv-va-spinner{
  width:36px;
  height:36px;
  border-radius:50%;
  border:2.5px solid var(--viv-card-line);
  border-top-color:var(--viv-agent);
  animation:viv-va-spin .85s linear infinite;
}

@keyframes viv-va-ping{0%{transform:scale(.6);opacity:.75}80%,100%{transform:scale(1.85);opacity:0}}
@keyframes viv-va-spin{to{transform:rotate(360deg)}}
@keyframes viv-va-pulse{0%,100%{opacity:1}50%{opacity:.4}}
@keyframes viv-va-breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
@keyframes viv-va-pop{from{transform:translateY(12px) scale(.97);opacity:0}to{transform:none;opacity:1}}

@media (max-width:480px){
  .viv-va-body{padding:20px 16px 18px}
  .viv-va-heading{font-size:29px}
  .viv-va-actions{flex-direction:column}
  .viv-va-mute,.viv-va-end{width:100%}
}
`

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
}

const WAVE_BARS = 44

function StudioWaveform({
  trackRef,
  speaker,
  isMuted,
}: {
  trackRef?: TrackReference
  speaker: "ai" | "user" | "thinking" | "idle"
  isMuted: boolean
}) {
  const volume = useTrackVolume(trackRef)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const loop = (now: number) => {
      if (now - last > 55) {
        last = now
        setTick((t) => t + 0.35)
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])

  const effectiveVol = isMuted && speaker === "user" ? 0 : volume

  return (
    <div className="viv-va-bars" data-speaker={speaker} aria-hidden="true">
      {Array.from({ length: WAVE_BARS }, (_, k) => {
        const envelope = Math.sin((k / (WAVE_BARS - 1)) * Math.PI) * 0.72 + 0.28
        let scale = 0.08

        if (speaker === "thinking") {
          scale = (0.14 + 0.16 * Math.abs(Math.sin(k * 0.35 - tick * 1.4))) * envelope + 0.06
        } else if (effectiveVol > 0.01) {
          const harmonic = Math.abs(Math.sin(k * 0.68 + tick * 2.1) * Math.cos(k * 0.24 - tick * 1.3))
          scale = Math.min(1, (0.12 + effectiveVol * 2.4 * harmonic) * envelope + 0.08)
        } else {
          scale = 0.07 + 0.03 * Math.sin(k * 0.4 + tick * 0.6) * envelope
        }

        return <i key={k} style={{ transform: `scaleY(${scale.toFixed(3)})` }} />
      })}
    </div>
  )
}

export default function VoiceAssistantUI() {
  const { state, audioTrack } = useVoiceAssistant()
  const { localParticipant, isMicrophoneEnabled } = useLocalParticipant()
  const connectionState = useConnectionState()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (connectionState !== "connected") return
    const timer = window.setInterval(() => {
      setElapsed((prev) => prev + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [connectionState])

  const micTrackPublication = localParticipant.getTrackPublication(Track.Source.Microphone)

  const isAISpeaking = state === "speaking" || state === "thinking"

  const micTrackRef: TrackReference | undefined = micTrackPublication
    ? {
        participant: localParticipant,
        source: Track.Source.Microphone,
        publication: micTrackPublication,
      }
    : undefined

  const activeTrack: TrackReference | undefined = isAISpeaking ? audioTrack : micTrackRef
  const speakerRole: "ai" | "user" | "thinking" | "idle" =
    state === "thinking" ? "thinking" : state === "speaking" ? "ai" : isMicrophoneEnabled ? "user" : "idle"

  const getStatusBadge = () => {
    if (!isMicrophoneEnabled) return "Microphone Muted"
    switch (state) {
      case "listening":
        return "Listening to you"
      case "thinking":
        return "Formulating follow-up"
      case "speaking":
        return "Interviewer speaking"
      default:
        return "Session live · Speak naturally"
    }
  }

  const toggleMute = async () => {
    try {
      await localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled)
    } catch {
      // Ignore permission toggle errors if device is locked
    }
  }

  if (connectionState === "connecting") {
    return (
      <div className="viv-va">
        <style>{VOICE_UI_CSS}</style>
        <div className="viv-va-card" role="status" aria-live="polite">
          <div className="viv-va-head">
            <div className="viv-va-head-left">
              <span className="viv-va-orb" aria-hidden="true" />
              <span className="viv-va-title">Vivaro Voice Studio</span>
            </div>
            <span className="viv-va-timer">SYNC</span>
          </div>
          <div className="viv-va-body">
            <div className="viv-va-connecting">
              <div className="viv-va-spinner" aria-hidden="true" />
              <h2 className="viv-va-heading" style={{ fontSize: 28, margin: "4px 0 0" }}>
                Establishing <em>audio bridge</em>
              </h2>
              <p className="viv-va-sub" style={{ margin: 0 }}>
                Connecting your microphone to the WebRTC room and waking up the interviewer...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="viv-va">
      <style>{VOICE_UI_CSS}</style>

      <div className="viv-va-card" role="region" aria-label="Live AI Technical Interview">
        {/* Card Header */}
        <div className="viv-va-head">
          <div className="viv-va-head-left">
            <span className={`viv-va-orb ${isAISpeaking ? "is-speaking" : ""}`} aria-hidden="true" />
            <span className="viv-va-title">Vivaro Voice Studio</span>
          </div>
          <span className="viv-va-timer" title="Elapsed session time">
            <span className="viv-va-rec-dot" aria-hidden="true" />
            <span>{formatDuration(elapsed)}</span>
          </span>
        </div>

        {/* Card Body */}
        <div className="viv-va-body">
          <div
            className="viv-va-pill-tag"
            data-speaker={isAISpeaking ? "ai" : "user"}
            aria-live="polite"
          >
            <span className="viv-va-pill-dot" aria-hidden="true" />
            <span>{getStatusBadge()}</span>
          </div>

          <h2 className="viv-va-heading">
            AI Technical <em>Interviewer</em>
          </h2>
          <p className="viv-va-sub">
            Your microphone is live. Answer naturally—Vivaro adapts follow-ups to your resume and projects.
          </p>

          {/* Dark Studio Waveform Stage */}
          <div className="viv-va-stage">
            <div className="viv-va-stage-top">
              <span className="viv-va-turn" data-user={!isAISpeaking}>
                <i aria-hidden="true" />
                <span>{isAISpeaking ? "Vivaro AI" : "Your Microphone"}</span>
              </span>
              <span>{state === "thinking" ? "Analyzing" : isAISpeaking ? "Speaking" : isMicrophoneEnabled ? "Live Input" : "Muted"}</span>
            </div>

            <StudioWaveform trackRef={activeTrack} speaker={speakerRole} isMuted={!isMicrophoneEnabled} />

            <div className="viv-va-stage-foot">
              <span>LiveKit WebRTC</span>
              <span>48 kHz · Echo Cancelled</span>
            </div>
          </div>

          {/* Controls */}
          <div className="viv-va-actions">
            <button
              type="button"
              className="viv-va-mute"
              onClick={toggleMute}
              aria-pressed={!isMicrophoneEnabled}
              aria-label={isMicrophoneEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {isMicrophoneEnabled ? (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="9" y="3" width="6" height="11" rx="3" />
                    <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                  </svg>
                  <span>Mute</span>
                </>
              ) : (
                <>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="2" y1="2" x2="22" y2="22" />
                    <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-1" />
                    <path d="M5 11v1a7 7 0 0 0 11.95 4.95" />
                    <path d="M9 9v3a3 3 0 0 0 5.12 2.12" />
                    <path d="M15 9.34V6a3 3 0 0 0-5.94-.6" />
                    <path d="M12 19v3" />
                  </svg>
                  <span>Unmute</span>
                </>
              )}
            </button>

            <DisconnectButton className="viv-va-end">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" />
                <line x1="22" y1="2" x2="2" y2="22" />
              </svg>
              <span>End Interview &amp; View Scorecard</span>
            </DisconnectButton>
          </div>
        </div>
      </div>
    </div>
  )
}