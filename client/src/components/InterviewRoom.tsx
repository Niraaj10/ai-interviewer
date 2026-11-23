import { useState, useEffect } from "react"
import { LiveKitRoom, RoomAudioRenderer } from "@livekit/components-react"
import { useInterviewToken } from "../hooks/useInterviewToken"
import VoiceAssistantUI from "./UI/VoiceAssistantUI"

interface InterviewRoomProps {
  interviewId: string
}

const ROOM_CSS = `
.viv-room{
  --viv-bg:#f8f5f0;
  --viv-ink:#100d0b;
  --viv-mute:#5c5852;
  --viv-faint:#87827a;
  --viv-line:rgba(16,13,11,.10);
  --viv-soft:#efeae2;
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
  position:relative;
  min-height:100svh;
  display:flex;
  flex-direction:column;
  background:var(--viv-bg);
  color:var(--viv-ink);
  font-family:var(--viv-sans);
  font-size:15px;
  line-height:1.5;
  overflow-x:clip;
  -webkit-font-smoothing:antialiased;
}
.viv-room *,.viv-room *::before,.viv-room *::after{box-sizing:border-box}

/* Top Nav */
.viv-nav{
  position:sticky;
  top:0;
  z-index:30;
  height:68px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding:0 28px;
  background:color-mix(in oklab,var(--viv-bg) 86%,transparent);
  -webkit-backdrop-filter:blur(14px) saturate(1.2);
  backdrop-filter:blur(14px) saturate(1.2);
  border-bottom:1px solid var(--viv-line);
}
.viv-brand{
  display:inline-flex;
  align-items:center;
  gap:9px;
  font-size:19px;
  font-weight:600;
  letter-spacing:-.03em;
  color:var(--viv-ink);
  text-decoration:none;
}
.viv-nav-actions{display:flex;align-items:center;gap:18px}
.viv-nav-link{
  font-size:13.5px;
  color:var(--viv-mute);
  text-decoration:none;
  transition:color .2s;
}
.viv-nav-link:hover{color:var(--viv-ink)}
.viv-session-tag{
  display:inline-flex;
  align-items:center;
  gap:7px;
  height:28px;
  padding:0 11px;
  border-radius:999px;
  background:var(--viv-soft);
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.05em;
  color:var(--viv-mute);
}
.viv-session-tag i{
  width:6px;
  height:6px;
  border-radius:50%;
  background:var(--viv-agent);
}

/* Main Stage */
.viv-main{
  flex:1;
  display:flex;
  flex-direction:column;
  align-items:center;
  padding:42px 20px 56px;
}

/* Announcement Badge */
.viv-badge{
  display:inline-flex;
  align-items:center;
  gap:10px;
  height:28px;
  padding:0 13px;
  border-radius:999px;
  background:var(--viv-soft);
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.07em;
  text-transform:uppercase;
  color:var(--viv-ink);
  margin-bottom:20px;
}
.viv-badge-dot{
  position:relative;
  width:7px;
  height:7px;
  border-radius:50%;
  background:var(--viv-accent);
}
.viv-badge-dot::after{
  content:"";
  position:absolute;
  inset:-4px;
  border-radius:50%;
  border:1px solid var(--viv-accent);
  animation:viv-ping 2.6s var(--viv-ease) infinite;
}

/* Serif Heading */
.viv-title{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:clamp(40px,5.8vw,62px);
  line-height:1.04;
  letter-spacing:-.03em;
  text-align:center;
  color:var(--viv-ink);
  margin:0;
}
.viv-title em{
  font-style:italic;
  color:var(--viv-accent);
}
.viv-sub{
  margin:16px auto 0;
  max-width:46ch;
  text-align:center;
  font-size:15px;
  line-height:1.75;
  color:var(--viv-mute);
}

/* Atmospheric Vista Frame */
.viv-vista-wrap{
  position:relative;
  width:100%;
  max-width:1120px;
  margin-top:34px;
  border-radius:18px;
  overflow:hidden;
  padding:44px 20px;
  display:flex;
  align-items:center;
  justify-content:center;
  box-shadow:0 32px 80px -32px rgba(16,13,11,.35);
  background:#4f3646;
}
.viv-vista-bg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  pointer-events:none;
}
.viv-vista-img{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  object-fit:cover;
  opacity:.85;
  pointer-events:none;
}
.viv-vista-shade{
  position:absolute;
  inset:0;
  background:linear-gradient(180deg,rgba(16,13,11,.14) 0%,rgba(16,13,11,.4) 100%);
  pointer-events:none;
}

/* Studio Card */
.viv-card{
  position:relative;
  z-index:2;
  width:100%;
  max-width:430px;
  background:var(--viv-card);
  color:var(--viv-card-ink);
  border-radius:16px;
  box-shadow:0 40px 90px -28px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.06);
  overflow:hidden;
  animation:viv-pop .6s var(--viv-ease) both;
}
.viv-card-head{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  height:52px;
  padding:0 16px;
  border-bottom:1px solid var(--viv-card-line);
}
.viv-orb{
  position:absolute;
  left:16px;
  width:22px;
  height:22px;
  border-radius:50%;
  background:radial-gradient(circle at 32% 30%,#fff 0 8%,transparent 30%),conic-gradient(from 210deg,#ff9a76,#f6c1ff,#8ab4ff,#9ff0d5,#ffd38a,#ff9a76);
  animation:viv-spin 9s linear infinite;
}
.viv-card-title{
  font-size:13.5px;
  font-weight:600;
  letter-spacing:-.01em;
}
.viv-card-step{
  position:absolute;
  right:16px;
  font:500 10.5px/1 var(--viv-mono);
  color:var(--viv-card-mute);
  letter-spacing:.05em;
}
.viv-card-body{
  padding:22px 20px 22px;
  display:flex;
  flex-direction:column;
  gap:16px;
}

/* Checklist Rows */
.viv-checks{
  display:flex;
  flex-direction:column;
  gap:8px;
}
.viv-check-row{
  display:flex;
  align-items:center;
  gap:12px;
  padding:11px 12px;
  border-radius:11px;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
}
.viv-check-ico{
  width:30px;
  height:30px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--viv-card);
  color:var(--viv-agent);
  box-shadow:0 0 0 1px var(--viv-card-line);
  flex:none;
}
.viv-check-meta b{
  display:block;
  font-size:12.5px;
  font-weight:600;
  color:var(--viv-card-ink);
}
.viv-check-meta span{
  display:block;
  font-size:11.5px;
  color:var(--viv-card-mute);
  margin-top:1px;
}

/* Primary Pill Button */
.viv-pill{
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  width:100%;
  height:44px;
  padding:0 22px;
  border-radius:999px;
  border:0;
  background:var(--viv-ink);
  color:var(--viv-bg);
  font-size:14px;
  font-weight:500;
  cursor:pointer;
  overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 10px 24px -10px rgba(16,13,11,.55);
  transition:transform .2s var(--viv-ease),background-color .25s;
}
.viv-pill:hover{background:#221c18}
.viv-pill:active{transform:scale(.988)}
.viv-roll{
  position:relative;
  display:inline-block;
  overflow:hidden;
  height:1.3em;
  line-height:1.3em;
}
.viv-roll>span{
  display:block;
  transition:transform .45s var(--viv-ease);
}
.viv-roll::after{
  content:attr(data-t);
  position:absolute;
  left:0;
  top:100%;
  transition:transform .45s var(--viv-ease);
}
.viv-pill:hover .viv-roll>span,
.viv-pill:hover .viv-roll::after{
  transform:translateY(-100%);
}

/* Status Footer inside Card */
.viv-note{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  font:500 10.5px/1.3 var(--viv-mono);
  letter-spacing:.04em;
  text-transform:uppercase;
  color:var(--viv-card-mute);
  padding-top:2px;
}
.viv-note-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#16a34a;
  box-shadow:0 0 0 3px rgba(22,163,74,.2);
}

/* Loading & Error States */
.viv-state-box{
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  padding:14px 8px 6px;
  gap:12px;
}
.viv-spinner{
  width:34px;
  height:34px;
  border-radius:50%;
  border:2.5px solid var(--viv-card-line);
  border-top-color:var(--viv-agent);
  animation:viv-spin .85s linear infinite;
}
.viv-state-title{
  font-size:15px;
  font-weight:600;
  color:var(--viv-card-ink);
  margin:0;
}
.viv-state-desc{
  font-size:13px;
  color:var(--viv-card-mute);
  line-height:1.6;
  margin:0;
  max-width:34ch;
}
.viv-err-badge{
  width:38px;
  height:38px;
  border-radius:50%;
  background:color-mix(in oklab,var(--viv-accent) 12%,transparent);
  color:var(--viv-accent);
  display:flex;
  align-items:center;
  justify-content:center;
}

/* Active LiveKit Room Shell */
.viv-live-shell{
  position:relative;
  z-index:2;
  width:100%;
  max-width:920px;
}

@keyframes viv-ping{0%{transform:scale(.6);opacity:.75}80%,100%{transform:scale(1.85);opacity:0}}
@keyframes viv-spin{to{transform:rotate(360deg)}}
@keyframes viv-pop{from{transform:translateY(12px) scale(.97);opacity:0}to{transform:none;opacity:1}}

@media (max-width:640px){
  .viv-nav{padding:0 16px}
  .viv-main{padding:28px 14px 40px}
  .viv-vista-wrap{padding:24px 12px;border-radius:14px}
  .viv-card-body{padding:16px}
}
`

function VivaroMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#F4D03F" />
      <path
        d="M10.5 10.5 L16 22.5 L21.5 10.5"
        fill="none"
        stroke="#111211"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EmberVistaBackdrop() {
  return (
    <>
      <svg
        className="viv-vista-bg"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="viv-room-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2c8a0" />
            <stop offset="70%" stopColor="#f6e2c8" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#viv-room-sky)" />
        <path d="M0 900 L0 480 Q400 410 800 470 T1600 450 L1600 900 Z" fill="#d59b86" opacity="0.78" />
        <path d="M0 900 L0 570 Q450 510 900 575 T1600 540 L1600 900 Z" fill="#b9767a" opacity="0.86" />
        <path d="M0 900 L0 670 Q500 620 1000 680 T1600 650 L1600 900 Z" fill="#8a5868" />
        <path d="M0 900 L0 780 Q550 740 1100 790 T1600 765 L1600 900 Z" fill="#4f3646" />
      </svg>
      <img
        className="viv-vista-img"
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=72&w=2200"
        alt=""
        loading="eager"
      />
      <div className="viv-vista-shade" aria-hidden="true" />
    </>
  )
}

export default function InterviewRoom({ interviewId }: InterviewRoomProps) {
  const { connectionDetails, isLoading, error, fetchToken } = useInterviewToken()
  const [hasUserJoined, setHasUserJoined] = useState(false)

  useEffect(() => {
    if (interviewId && hasUserJoined) {
      fetchToken(interviewId)
    }
  }, [interviewId, fetchToken, hasUserJoined])

  const shortId = interviewId ? interviewId.slice(0, 8) : "live"

  return (
    <div className="viv-room">
      <style>{ROOM_CSS}</style>

      {/* Top Navigation matching Home & Form Pages */}
      <header className="viv-nav">
        <a href="/" className="viv-brand" aria-label="Vivaro Home">
          <VivaroMark size={24} />
          <span>Vivaro</span>
        </a>
        <div className="viv-nav-actions">
          <span className="viv-session-tag" title="Interview Session ID">
            <i aria-hidden="true" />
            <span>ID · {shortId}</span>
          </span>
          <a href="/interview" className="viv-nav-link">
            New setup
          </a>
        </div>
      </header>

      {/* Main Stage */}
      <main className="viv-main">
        {!hasUserJoined && (
          <>
            <div className="viv-badge">
              <span className="viv-badge-dot" aria-hidden="true" />
              <span>Built for Gen AI in education</span>
            </div>

            <h1 className="viv-title">
              Ready to Start Your <em>Interview?</em>
            </h1>
            <p className="viv-sub">
              Your resume and GitHub context are loaded. Joining establishes a secure WebRTC audio room and activates
              your microphone.
            </p>

            <div className="viv-vista-wrap">
              <EmberVistaBackdrop />

              <div className="viv-card" role="region" aria-label="Voice Room Check">
                <div className="viv-card-head">
                  <span className="viv-orb" aria-hidden="true" />
                  <span className="viv-card-title">Voice Room Check</span>
                  <span className="viv-card-step">02 / 02</span>
                </div>

                <div className="viv-card-body">
                  <div className="viv-checks">
                    <div className="viv-check-row">
                      <span className="viv-check-ico" aria-hidden="true">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="9" y="3" width="6" height="11" rx="3" />
                          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                        </svg>
                      </span>
                      <div className="viv-check-meta">
                        <b>Microphone &amp; Echo Cancellation</b>
                        <span>48 kHz mono audio with noise suppression</span>
                      </div>
                    </div>

                    <div className="viv-check-row">
                      <span className="viv-check-ico" aria-hidden="true">
                        <svg
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" />
                        </svg>
                      </span>
                      <div className="viv-check-meta">
                        <b>Profile Context Synced</b>
                        <span>Tailored technical &amp; architecture follow-ups</span>
                      </div>
                    </div>
                  </div>

                  <button type="button" onClick={() => setHasUserJoined(true)} className="viv-pill">
                    <span className="viv-roll" data-t="Join Interview Room">
                      <span>Join Interview Room</span>
                    </span>
                  </button>

                  <div className="viv-note">
                    <span className="viv-note-dot" aria-hidden="true" />
                    <span>LiveKit WebRTC · Gemini Native Audio</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {hasUserJoined && isLoading && (
          <div className="viv-vista-wrap" style={{ marginTop: 12, minHeight: 460 }}>
            <EmberVistaBackdrop />
            <div className="viv-card" role="status" aria-live="polite">
              <div className="viv-card-head">
                <span className="viv-orb" aria-hidden="true" />
                <span className="viv-card-title">Connecting Studio</span>
                <span className="viv-card-step">LIVE</span>
              </div>
              <div className="viv-card-body">
                <div className="viv-state-box">
                  <div className="viv-spinner" aria-hidden="true" />
                  <p className="viv-state-title">Configuring real-time media pipeline...</p>
                  <p className="viv-state-desc">
                    Establishing an encrypted WebRTC channel and waking up your AI interviewer.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasUserJoined && !isLoading && error && (
          <div className="viv-vista-wrap" style={{ marginTop: 12, minHeight: 460 }}>
            <EmberVistaBackdrop />
            <div className="viv-card" role="alert">
              <div className="viv-card-head">
                <span className="viv-orb" aria-hidden="true" />
                <span className="viv-card-title">Session Interrupted</span>
                <span className="viv-card-step">ERR</span>
              </div>
              <div className="viv-card-body">
                <div className="viv-state-box">
                  <div className="viv-err-badge" aria-hidden="true">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v5M12 16h.01" />
                    </svg>
                  </div>
                  <p className="viv-state-title">Connection Blocked</p>
                  <p className="viv-state-desc">{error}</p>
                </div>
                <button type="button" onClick={() => setHasUserJoined(false)} className="viv-pill">
                  <span className="viv-roll" data-t="Try Again">
                    <span>Try Again</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {hasUserJoined && !isLoading && !error && connectionDetails && (
          <div className="viv-vista-wrap" style={{ marginTop: 8, padding: "28px 16px" }}>
            <EmberVistaBackdrop />
            <div className="viv-live-shell">
              <LiveKitRoom
                token={connectionDetails.token}
                serverUrl={connectionDetails.serverUrl}
                connect={true}
                audio={{
                  echoCancellation: true,
                  noiseSuppression: true,
                  autoGainControl: true,
                  channelCount: 1,
                  sampleRate: 48000,
                }}
                video={false}
                onDisconnected={() => {
                  window.location.href = `/interview/${interviewId}/summary`
                }}
              >
                <RoomAudioRenderer />
                <VoiceAssistantUI />
              </LiveKitRoom>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}




// import { useState, useEffect } from "react";
// import {
//     LiveKitRoom,
//     RoomAudioRenderer,
// } from "@livekit/components-react";
// import { useInterviewToken } from "../hooks/useInterviewToken";
// import VoiceAssistantUI from "./UI/VoiceAssistantUI";
// interface InterviewRoomProps {
//     interviewId: string;
// }

// export default function InterviewRoom({ interviewId }: InterviewRoomProps) {
//     const { connectionDetails, isLoading, error, fetchToken } = useInterviewToken();
//     const [hasUserJoined, setHasUserJoined] = useState(false);
//     useEffect(() => {
//         if (interviewId && hasUserJoined) {
//             fetchToken(interviewId);
//         }
//     }, [interviewId, fetchToken, hasUserJoined]);

//     if (!hasUserJoined) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-[#F4F0E6] px-4">
//                 <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
//                     <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
//                         Built for Gen AI in education
//                     </span>
//                     <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Ready to Start Your Interview?</h2>
//                     <p className="text-sm text-gray-600 mb-6">
//                         Clicking below will establish a secure connection and activate your microphone.
//                     </p>
//                     <button
//                         onClick={() => setHasUserJoined(true)}
//                         className="w-full py-3 bg-[#F4D03F] hover:bg-[#e8c52e] text-black font-semibold rounded-full transition duration-200"
//                     >
//                         Join Interview Room
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-[#F4F0E6]">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-black mx-auto"></div>
//                     <p className="text-sm font-medium text-gray-600 mt-4 animate-pulse">
//                         Configuring real-time media pipeline...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         console.log("error : ", error)
//         return (
//             <div className="flex items-center justify-center min-h-screen bg-[#F4F0E6] px-4">
//                 <div className="p-6 max-w-sm bg-white rounded-xl shadow-md border border-red-200 text-center" role="alert">
//                     <p className="text-red-600 font-semibold mb-2">Connection Blocked</p>
//                     <p className="text-sm text-gray-600">{error}</p>
//                     <button 
//                         onClick={() => setHasUserJoined(false)}
//                         className="mt-4 text-xs font-medium text-gray-600 underline"
//                     >
//                         Try Again
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     if (!connectionDetails) return null;
    
//     return (
//         <div className="min-h-screen bg-[#F4F0E6] py-12 px-4 sm:px-6 lg:px-8">
//             <LiveKitRoom
//                 token={connectionDetails.token}
//                 serverUrl={connectionDetails.serverUrl}
//                 connect={true}
//                 audio={{
//                     echoCancellation: true,    
//                     noiseSuppression: true,    
//                     autoGainControl: true,    
//                     channelCount: 1,           
//                     sampleRate: 48000          
//                 }}
//                 video={false}
//                 onDisconnected={() => {
//                     window.location.href = `/interview/${interviewId}/summary`;
//                 }}
//             >
//                 <RoomAudioRenderer />
                
//                 <VoiceAssistantUI />
//                 {/* <div className="mt-8 max-w-md mx-auto p-2 flex justify-center">
//                     <AudioConference />
//                 </div> */}
//             </LiveKitRoom>
//         </div>
//     );
// }