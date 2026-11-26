import { useEffect, useState, useCallback } from "react"
import { createFileRoute } from "@tanstack/react-router"
import axios from "axios"
// import { BACKEND } from "../../../lib/config"

const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // Main deplyed
// const VITE_BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Route = createFileRoute("/interview/$interviewId/summary")({
  component: RouteComponent,
})

const SUMMARY_CSS = `
.viv-sum{
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
.viv-sum *,.viv-sum *::before,.viv-sum *::after{box-sizing:border-box}

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
  padding:42px 20px 64px;
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
  background:var(--viv-agent);
}
.viv-badge-dot::after{
  content:"";
  position:absolute;
  inset:-4px;
  border-radius:50%;
  border:1px solid var(--viv-agent);
  animation:viv-ping 2.6s var(--viv-ease) infinite;
}

/* Serif Heading */
.viv-title{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:clamp(40px,5.8vw,64px);
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
  max-width:48ch;
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
  padding:48px 20px;
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
  background:linear-gradient(180deg,rgba(16,13,11,.14) 0%,rgba(16,13,11,.42) 100%);
  pointer-events:none;
}

/* Studio Card */
.viv-card{
  position:relative;
  z-index:2;
  width:100%;
  max-width:640px;
  background:var(--viv-card);
  color:var(--viv-card-ink);
  border-radius:18px;
  box-shadow:0 40px 90px -28px rgba(0,0,0,.68),0 0 0 1px rgba(0,0,0,.06);
  overflow:hidden;
  animation:viv-pop .6s var(--viv-ease) both;
}
.viv-card.is-compact{max-width:440px}

.viv-card-head{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:space-between;
  height:54px;
  padding:0 20px;
  border-bottom:1px solid var(--viv-card-line);
}
.viv-head-left{
  display:inline-flex;
  align-items:center;
  gap:10px;
}
.viv-orb{
  width:22px;
  height:22px;
  border-radius:50%;
  flex:none;
  background:radial-gradient(circle at 32% 30%,#fff 0 8%,transparent 30%),conic-gradient(from 210deg,#ff9a76,#f6c1ff,#8ab4ff,#9ff0d5,#ffd38a,#ff9a76);
  animation:viv-spin 9s linear infinite;
}
.viv-card-title{
  font-size:13.5px;
  font-weight:600;
  letter-spacing:-.01em;
}
.viv-card-step{
  display:inline-flex;
  align-items:center;
  gap:6px;
  height:26px;
  padding:0 10px;
  border-radius:999px;
  background:var(--viv-card-soft);
  font:500 10.5px/1 var(--viv-mono);
  color:var(--viv-card-mute);
  letter-spacing:.05em;
  text-transform:uppercase;
}
.viv-card-body{
  padding:28px 26px 26px;
  display:flex;
  flex-direction:column;
  gap:22px;
}

/* Score Hero Ring + Tier Banner */
.viv-score-hero{
  display:flex;
  align-items:center;
  gap:22px;
  padding:20px;
  border-radius:14px;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
}
.viv-ring-wrap{
  position:relative;
  width:104px;
  height:104px;
  flex:none;
  display:flex;
  align-items:center;
  justify-content:center;
}
.viv-ring-svg{
  position:absolute;
  inset:0;
  width:100%;
  height:100%;
  transform:rotate(-90deg);
}
.viv-ring-num{
  display:flex;
  flex-direction:column;
  align-items:center;
  line-height:1;
}
.viv-ring-num b{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:40px;
  letter-spacing:-.03em;
  color:var(--viv-card-ink);
  font-variant-numeric:tabular-nums;
}
.viv-ring-num span{
  font:500 10.5px/1 var(--viv-mono);
  color:var(--viv-card-mute);
  margin-top:4px;
}
.viv-score-meta{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
  gap:7px;
  min-width:0;
}
.viv-tier-pill{
  display:inline-flex;
  align-items:center;
  gap:7px;
  height:26px;
  padding:0 11px;
  border-radius:999px;
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.06em;
  text-transform:uppercase;
}
.viv-tier-pill[data-tier="strong"]{
  background:color-mix(in oklab,var(--viv-agent) 13%,var(--viv-card));
  color:var(--viv-agent);
}
.viv-tier-pill[data-tier="solid"]{
  background:color-mix(in oklab,#d97706 13%,var(--viv-card));
  color:#b45309;
}
.viv-tier-pill[data-tier="needs-work"]{
  background:color-mix(in oklab,var(--viv-accent) 12%,var(--viv-card));
  color:var(--viv-accent);
}
.viv-tier-pill i{
  width:6px;
  height:6px;
  border-radius:50%;
  background:currentColor;
}
.viv-score-meta h3{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:26px;
  line-height:1.12;
  letter-spacing:-.02em;
  color:var(--viv-card-ink);
  margin:0;
}
.viv-score-meta p{
  font-size:13px;
  color:var(--viv-card-mute);
  line-height:1.55;
  margin:0;
}

/* Feedback Panel */
.viv-fb-box{
  border-radius:14px;
  background:#100d0b;
  color:#f5f2ec;
  padding:20px 22px;
  box-shadow:0 20px 44px -22px rgba(16,13,11,.65),inset 0 0 0 1px rgba(255,255,255,.08);
}
.viv-fb-head{
  display:flex;
  align-items:center;
  justify-content:space-between;
  padding-bottom:12px;
  margin-bottom:14px;
  border-bottom:1px solid rgba(255,255,255,.1);
  font:500 10.5px/1 var(--viv-mono);
  letter-spacing:.06em;
  text-transform:uppercase;
  color:rgba(245,242,236,.62);
}
.viv-fb-head-left{
  display:inline-flex;
  align-items:center;
  gap:8px;
  color:#f5f2ec;
}
.viv-fb-head-left i{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#2dd4bf;
  box-shadow:0 0 0 3px rgba(45,212,191,.22);
}
.viv-fb-copy{
  font-size:13.5px;
  line-height:1.75;
  color:rgba(245,242,236,.88);
  white-space:pre-line;
  margin:0;
}
.viv-copy-btn{
  border:0;
  background:rgba(255,255,255,.09);
  color:#f5f2ec;
  height:24px;
  padding:0 9px;
  border-radius:999px;
  font:500 10px/1 var(--viv-mono);
  letter-spacing:.05em;
  text-transform:uppercase;
  cursor:pointer;
  transition:background-color .2s;
}
.viv-copy-btn:hover{background:rgba(255,255,255,.18)}

/* Action Row */
.viv-actions{
  display:flex;
  align-items:center;
  gap:10px;
}
.viv-pill{
  position:relative;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  flex:1;
  height:44px;
  padding:0 22px;
  border-radius:999px;
  border:0;
  background:var(--viv-ink);
  color:var(--viv-bg);
  font-size:13.5px;
  font-weight:500;
  text-decoration:none;
  cursor:pointer;
  overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 10px 24px -10px rgba(16,13,11,.55);
  transition:transform .2s var(--viv-ease),background-color .25s;
}
.viv-pill:hover{background:#221c18}
.viv-pill:active{transform:scale(.988)}
.viv-pill.is-soft{
  background:var(--viv-card-soft);
  color:var(--viv-card-ink);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
}
.viv-pill.is-soft:hover{background:#ebe6dc}
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

/* Loading & Pending States */
.viv-state-box{
  display:flex;
  flex-direction:column;
  align-items:center;
  text-align:center;
  padding:14px 8px 6px;
  gap:12px;
}
.viv-spinner{
  width:36px;
  height:36px;
  border-radius:50%;
  border:2.5px solid var(--viv-card-line);
  border-top-color:var(--viv-agent);
  animation:viv-spin .85s linear infinite;
}
.viv-state-title{
  font-family:var(--viv-serif);
  font-weight:400;
  font-size:28px;
  line-height:1.1;
  color:var(--viv-card-ink);
  margin:0;
}
.viv-state-title em{
  font-style:italic;
  color:var(--viv-accent);
}
.viv-state-desc{
  font-size:13px;
  color:var(--viv-card-mute);
  line-height:1.6;
  margin:0;
  max-width:34ch;
}

@keyframes viv-ping{0%{transform:scale(.6);opacity:.75}80%,100%{transform:scale(1.85);opacity:0}}
@keyframes viv-spin{to{transform:rotate(360deg)}}
@keyframes viv-pop{from{transform:translateY(12px) scale(.97);opacity:0}to{transform:none;opacity:1}}

@media (max-width:640px){
  .viv-nav{padding:0 16px}
  .viv-main{padding:28px 14px 40px}
  .viv-vista-wrap{padding:24px 12px;border-radius:14px}
  .viv-card-body{padding:18px 16px}
  .viv-score-hero{flex-direction:column;text-align:center}
  .viv-score-meta{align-items:center}
  .viv-actions{flex-direction:column}
  .viv-pill{width:100%}
}
`

function PrepAiMark({ size = 24 }: { size?: number }) {
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
          <linearGradient id="viv-sum-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2c8a0" />
            <stop offset="70%" stopColor="#f6e2c8" />
          </linearGradient>
        </defs>
        <rect width="1600" height="900" fill="url(#viv-sum-sky)" />
        <path d="M0 900 L0 480 Q400 410 800 470 T1600 450 L1600 900 Z" fill="#d59b86" opacity="0.78" />
        <path d="M0 900 L0 570 Q450 510 900 575 T1600 540 L1600 900 Z" fill="#b9767a" opacity="0.86" />
        <path d="M0 900 L0 670 Q500 620 1000 680 T1600 650 L1600 900 Z" fill="#8a5868" />
        <path d="M0 900 L0 780 Q550 740 1100 790 T1600 765 L1600 900 Z" fill="#4f3646" />
      </svg>
      <img
        className="viv-vista-img"
        src="https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=72&w=2200"
        alt=""
        loading="eager"
      />
      <div className="viv-vista-shade" aria-hidden="true" />
    </>
  )
}

function getScoreTier(score: number) {
  if (score >= 80) {
    return {
      tier: "strong",
      badge: "Strong Readiness",
      headline: "Well-calibrated technical depth",
      summary: "Clear architectural reasoning, strong project ownership, and confident spoken delivery.",
      ringColor: "#0f7c6e",
    }
  }
  if (score >= 60) {
    return {
      tier: "solid",
      badge: "Solid Foundation",
      headline: "Good fundamentals, room to sharpen",
      summary: "Core concepts are in place—focus on system trade-offs and edge-case depth next.",
      ringColor: "#d97706",
    }
  }
  return {
    tier: "needs-work",
    badge: "Targeted Practice Needed",
    headline: "Build deeper architectural clarity",
    summary: "Review the feedback points below and practice explaining your project decisions aloud.",
    ringColor: "#d9480f",
  }
}

function RouteComponent() {
  const { interviewId } = Route.useParams()
  const [report, setReport] = useState<{ score: number | null; feedback: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [copied, setCopied] = useState(false)

  const fetchReportCard = useCallback(async () => {
    try {
      const res = await axios.get(`${VITE_BACKEND_BASE_URL}/api/v1/interview/${interviewId}`)
      if (res.data && res.data.success) {
        const interviewPayload = res.data.data
        setReport({
          score: interviewPayload.score,
          feedback: interviewPayload.feedback,
        })
      }
    } catch (err) {
      console.error("Could not pull scorecard:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [interviewId])

  useEffect(() => {
    if (interviewId) {
      fetchReportCard()
    }
  }, [interviewId, fetchReportCard])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchReportCard()
  }

  const handleCopyFeedback = async () => {
    if (!report?.feedback) return
    try {
      await navigator.clipboard.writeText(
        `PrepAi Mock Interview Scorecard (${report.score}/100)\n\n${report.feedback}`,
      )
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard permission restrictions
    }
  }

  const shortId = interviewId ? interviewId.slice(0, 8) : "report"
  const scoreValue = report?.score ?? 0
  const clampedScore = Math.max(0, Math.min(100, scoreValue))
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference
  const tierInfo = getScoreTier(clampedScore)

  return (
    <div className="viv-sum">
      <style>{SUMMARY_CSS}</style>

      {/* Top Navigation matching Home, Form & Room Pages */}
      <header className="viv-nav">
        <a href="/" className="viv-brand" aria-label="PrepAi Home">
          <PrepAiMark size={24} />
          <span>PrepAi</span>
        </a>
        <div className="viv-nav-actions">
          <span className="viv-session-tag" title="Interview Session ID">
            <i aria-hidden="true" />
            <span>ID · {shortId}</span>
          </span>
          <a href="/prep" className="viv-nav-link">
            Plan study
          </a>
          <a href="/interview" className="viv-nav-link">
            New interview
          </a>
        </div>
      </header>

      {/* Main Stage */}
      <main className="viv-main">
        <div className="viv-badge">
          <span className="viv-badge-dot" aria-hidden="true" />
          <span>Official Evaluation Report</span>
        </div>

        <h1 className="viv-title">
          Performance <em>Scorecard</em>
        </h1>
        <p className="viv-sub">
          Evaluated against our 4-pillar engineering rubric across technical accuracy, project ownership, reasoning, and
          spoken clarity.
        </p>

        <div className="viv-vista-wrap">
          <EmberVistaBackdrop />

          {loading ? (
            <div className="viv-card is-compact" role="status" aria-live="polite">
              <div className="viv-card-head">
                <div className="viv-head-left">
                  <span className="viv-orb" aria-hidden="true" />
                  <span className="viv-card-title">PrepAi Rubric Engine</span>
                </div>
                <span className="viv-card-step">SYNC</span>
              </div>
              <div className="viv-card-body">
                <div className="viv-state-box">
                  <div className="viv-spinner" aria-hidden="true" />
                  <h2 className="viv-state-title">
                    Analyzing <em>transcript metrics</em>
                  </h2>
                  <p className="viv-state-desc">
                    Retrieving your spoken turns, rubric evaluation, and personalized improvement notes...
                  </p>
                </div>
              </div>
            </div>
          ) : !report || report.score === null ? (
            <div className="viv-card is-compact" role="status" aria-live="polite">
              <div className="viv-card-head">
                <div className="viv-head-left">
                  <span className="viv-orb" aria-hidden="true" />
                  <span className="viv-card-title">PrepAi Rubric Engine</span>
                </div>
                <span className="viv-card-step">GRADING</span>
              </div>
              <div className="viv-card-body">
                <div className="viv-state-box">
                  <div className="viv-spinner" aria-hidden="true" />
                  <h2 className="viv-state-title">
                    Compiling <em>evaluation...</em>
                  </h2>
                  <p className="viv-state-desc">
                    Gemini is finishing the technical rubric scoring on your interview transcript. Check back in a few
                    seconds.
                  </p>
                </div>

                <button type="button" onClick={handleRefresh} disabled={refreshing} className="viv-pill">
                  <span className="viv-roll" data-t={refreshing ? "Checking..." : "Refresh Scorecard"}>
                    <span>{refreshing ? "Checking..." : "Refresh Scorecard"}</span>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="viv-card" role="region" aria-label="Interview Scorecard Report">
              {/* Card Header */}
              <div className="viv-card-head">
                <div className="viv-head-left">
                  <span className="viv-orb" aria-hidden="true" />
                  <span className="viv-card-title">PrepAi Rubric Report</span>
                </div>
                <span className="viv-card-step">0–100 SCALE</span>
              </div>

              {/* Card Body */}
              <div className="viv-card-body">
                {/* Score Ring + Readiness Tier */}
                <div className="viv-score-hero">
                  <div className="viv-ring-wrap" aria-label={`Score ${report.score} out of 100`}>
                    <svg className="viv-ring-svg" viewBox="0 0 104 104" aria-hidden="true">
                      <circle
                        cx="52"
                        cy="52"
                        r={radius}
                        fill="none"
                        stroke="rgba(16,13,11,0.09)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="52"
                        cy="52"
                        r={radius}
                        fill="none"
                        stroke={tierInfo.ringColor}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        style={{ transition: "stroke-dashoffset 0.9s cubic-bezier(.22,1,.36,1)" }}
                      />
                    </svg>
                    <div className="viv-ring-num">
                      <b>{report.score}</b>
                      <span>/ 100</span>
                    </div>
                  </div>

                  <div className="viv-score-meta">
                    <span className="viv-tier-pill" data-tier={tierInfo.tier}>
                      <i aria-hidden="true" />
                      <span>{tierInfo.badge}</span>
                    </span>
                    <h3>{tierInfo.headline}</h3>
                    <p>{tierInfo.summary}</p>
                  </div>
                </div>

                {/* Dark Studio Feedback Container */}
                <div className="viv-fb-box">
                  <div className="viv-fb-head">
                    <span className="viv-fb-head-left">
                      <i aria-hidden="true" />
                      <span>Interviewer Feedback &amp; Takeaways</span>
                    </span>
                    <button type="button" className="viv-copy-btn" onClick={handleCopyFeedback}>
                      {copied ? "Copied" : "Copy"}
                    </button>
                  </div>
                  <p className="viv-fb-copy">
                    {report.feedback || "No detailed feedback notes were returned for this session."}
                  </p>
                </div>

                {/* Next Step Actions */}
                <div className="viv-actions">
                  <a href="/prep" className="viv-pill is-soft">
                    <span className="viv-roll" data-t="Plan Study Roadmap">
                      <span>Plan Study Roadmap</span>
                    </span>
                  </a>
                  <a href="/interview" className="viv-pill">
                    <span className="viv-roll" data-t="Start Another Interview">
                      <span>Start Another Interview</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}