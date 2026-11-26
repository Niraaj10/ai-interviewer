import axios from "axios"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { StudyRoadmap } from "./StudyRoadmap"

const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL
// const VITE_BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL

const PREP_CSS = `
.viv-prep{
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
.viv-prep *,.viv-prep *::before,.viv-prep *::after{box-sizing:border-box}

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
  font-size:clamp(42px,6vw,64px);
  line-height:1.03;
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
  margin-top:36px;
  border-radius:18px;
  overflow:hidden;
  padding:44px 20px;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:24px;
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
  max-width:520px;
  background:var(--viv-card);
  color:var(--viv-card-ink);
  border-radius:16px;
  box-shadow:0 40px 90px -28px rgba(0,0,0,.65),0 0 0 1px rgba(0,0,0,.06);
  overflow:hidden;
  animation:viv-pop .6s var(--viv-ease) both;
}
.viv-card.is-wide{max-width:680px}
.viv-card-head{
  position:relative;
  display:flex;
  align-items:center;
  justify-content:center;
  height:52px;
  padding:0 18px;
  border-bottom:1px solid var(--viv-card-line);
}
.viv-orb{
  position:absolute;
  left:18px;
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
  right:18px;
  display:inline-flex;
  align-items:center;
  height:24px;
  padding:0 9px;
  border-radius:999px;
  background:var(--viv-card-soft);
  font:500 10.5px/1 var(--viv-mono);
  color:var(--viv-card-mute);
  letter-spacing:.05em;
  text-transform:uppercase;
}
.viv-card-body{
  padding:22px 22px 24px;
  display:flex;
  flex-direction:column;
  gap:18px;
}

/* Form Fields */
.viv-field{display:flex;flex-direction:column;gap:7px}
.viv-field-head{
  display:flex;
  align-items:baseline;
  justify-content:space-between;
}
.viv-field-head label{
  font-size:12.5px;
  font-weight:600;
  color:var(--viv-card-ink);
}
.viv-field-head span{
  font:500 10.5px/1 var(--viv-mono);
  color:var(--viv-card-mute);
  text-transform:uppercase;
  letter-spacing:.04em;
}
.viv-textarea{
  width:100%;
  padding:12px 14px;
  border-radius:11px;
  border:0;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  font-family:var(--viv-sans);
  font-size:13.5px;
  line-height:1.6;
  color:var(--viv-card-ink);
  outline:none;
  resize:none;
  transition:box-shadow .2s,background-color .2s;
}
.viv-textarea::placeholder{color:var(--viv-faint)}
.viv-textarea:focus{
  background:#fff;
  box-shadow:inset 0 0 0 1.5px var(--viv-agent);
}
.viv-textarea:disabled{opacity:.55;cursor:not-allowed}

/* Drag & Drop Resume Zone */
.viv-drop{
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
  min-height:108px;
  padding:14px;
  border:1.5px dashed color-mix(in oklab,var(--viv-card-ink) 22%,transparent);
  border-radius:12px;
  background:var(--viv-card-soft);
  font-size:12.5px;
  color:var(--viv-card-mute);
  cursor:pointer;
  text-align:center;
  transition:border-color .25s,background-color .25s;
}
.viv-drop:hover,.viv-drop.is-over{
  border-color:var(--viv-agent);
  background:color-mix(in oklab,var(--viv-agent) 6%,var(--viv-card));
}
.viv-drop.is-disabled{opacity:.55;pointer-events:none}
.viv-drop-icons{
  display:flex;
  align-items:center;
  gap:8px;
}
.viv-drop-icons span{
  width:28px;
  height:28px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--viv-card);
  box-shadow:0 0 0 1px var(--viv-card-line),0 2px 5px -2px rgba(0,0,0,.14);
  color:var(--viv-card-ink);
  transition:transform .35s var(--viv-ease);
}
.viv-drop-icons em{
  width:14px;
  height:2px;
  border-radius:2px;
  background:var(--viv-accent);
  font-style:normal;
}
.viv-drop:hover .viv-drop-icons span{transform:translateY(-3px)}
.viv-drop u{
  color:var(--viv-card-ink);
  font-weight:500;
  text-decoration-color:color-mix(in oklab,currentColor 35%,transparent);
  text-underline-offset:3px;
}
.viv-sr{
  position:absolute;
  width:1px;
  height:1px;
  padding:0;
  margin:-1px;
  overflow:hidden;
  clip:rect(0,0,0,0);
  white-space:nowrap;
  border:0;
}

/* Selected File Pill */
.viv-file{
  display:grid;
  grid-template-columns:32px 1fr auto;
  align-items:center;
  gap:10px;
  padding:10px 12px;
  border-radius:11px;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  animation:viv-pop .35s var(--viv-ease) both;
}
.viv-file-ico{
  width:32px;
  height:32px;
  border-radius:8px;
  display:flex;
  align-items:center;
  justify-content:center;
  background:var(--viv-card);
  color:var(--viv-agent);
  box-shadow:0 0 0 1px var(--viv-card-line);
}
.viv-file-meta{min-width:0}
.viv-file-meta b{
  display:block;
  font-size:12.5px;
  font-weight:600;
  color:var(--viv-card-ink);
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.viv-file-meta span{
  display:block;
  font:500 10.5px/1.3 var(--viv-mono);
  color:var(--viv-card-mute);
  margin-top:2px;
}
.viv-file-x{
  width:26px;
  height:26px;
  border-radius:7px;
  border:0;
  background:transparent;
  color:var(--viv-card-mute);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:background-color .2s,color .2s;
}
.viv-file-x:hover{background:var(--viv-card);color:var(--viv-card-ink)}

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
  text-decoration:none;
  cursor:pointer;
  overflow:hidden;
  box-shadow:0 1px 0 rgba(255,255,255,.12) inset,0 10px 24px -10px rgba(16,13,11,.55);
  transition:transform .2s var(--viv-ease),background-color .25s,opacity .2s;
}
.viv-pill:hover:not(:disabled){background:#221c18}
.viv-pill:active:not(:disabled){transform:scale(.988)}
.viv-pill:disabled{opacity:.6;cursor:not-allowed}
.viv-pill.is-accent{
  background:var(--viv-agent);
  color:#ffffff;
}
.viv-pill.is-accent:hover:not(:disabled){background:#0c665b}
.viv-pill.is-soft{
  background:var(--viv-card-soft);
  color:var(--viv-card-ink);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
}
.viv-pill.is-soft:hover:not(:disabled){background:#ebe6dc}
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
.viv-pill:hover:not(:disabled) .viv-roll>span,
.viv-pill:hover:not(:disabled) .viv-roll::after{
  transform:translateY(-100%);
}

/* Generated Questions List */
.viv-q-list{
  list-style:none;
  margin:0;
  padding:0;
  display:flex;
  flex-direction:column;
  gap:10px;
}
.viv-q-item{
  display:flex;
  align-items:flex-start;
  gap:12px;
  padding:13px 14px;
  border-radius:12px;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  transition:background-color .2s;
}
.viv-q-item:hover{background:#f0ece3}
.viv-q-num{
  flex:none;
  min-width:28px;
  height:24px;
  padding:0 6px;
  border-radius:7px;
  background:var(--viv-card);
  box-shadow:0 0 0 1px var(--viv-card-line);
  font:600 10.5px/1 var(--viv-mono);
  color:var(--viv-accent);
  display:flex;
  align-items:center;
  justify-content:center;
  margin-top:1px;
}
.viv-q-text{
  font-size:13.5px;
  line-height:1.6;
  color:var(--viv-card-ink);
  margin:0;
}

.viv-q-actions{
  display:flex;
  align-items:center;
  gap:10px;
  padding-top:4px;
}

.viv-roadmap-wrap{
  position:relative;
  z-index:2;
  width:100%;
  max-width:680px;
}

@keyframes viv-ping{0%{transform:scale(.6);opacity:.75}80%,100%{transform:scale(1.85);opacity:0}}
@keyframes viv-spin{to{transform:rotate(360deg)}}
@keyframes viv-pop{from{transform:translateY(12px) scale(.97);opacity:0}to{transform:none;opacity:1}}

@media (max-width:640px){
  .viv-nav{padding:0 16px}
  .viv-main{padding:28px 14px 44px}
  .viv-vista-wrap{padding:24px 12px;border-radius:14px}
  .viv-card-body{padding:18px 16px}
  .viv-q-actions{flex-direction:column}
  .viv-pill{width:100%}
}
`

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

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

export function PrepPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [questionsLoading, setQuestionsLoading] = useState(false)
  const [questions, setQuestions] = useState<string[]>([])
  const [resumeUploaded, setResumeUploaded] = useState(false)
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [resumeText, setResumeText] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(file: File | undefined) {
    if (!file) return
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.info("Please upload a valid PDF resume", { position: "top-center" })
      return
    }
    setSelectedFile(file)
    setQuestions([])
    setResumeUploaded(false)
    setShowRoadmap(false)
  }

  function clearFile() {
    setSelectedFile(null)
    setQuestions([])
    setResumeUploaded(false)
    setShowRoadmap(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onSuggestQuestions() {
    const file = selectedFile || fileInputRef.current?.files?.[0]

    if (!file) {
      toast.info("Upload your resume first", { position: "top-center" })
      return
    }
    if (!jobDescription.trim()) {
      toast.info("Paste a job description first", { position: "top-center" })
      return
    }

    setQuestionsLoading(true)
    setQuestions([])
    setShowRoadmap(false)

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("jobDescription", jobDescription.trim())

    try {
      const res = await axios.post(`${VITE_BACKEND_BASE_URL}/api/v1/prep/suggest-questions`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data?.success || res.data?.data) {
        setQuestions(res.data.data.questions)
        setResumeUploaded(true)
        setResumeText(res.data.data.resumeText)
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to generate questions. Please try again."
      toast.error(errorMsg)
    } finally {
      setQuestionsLoading(false)
    }
  }

  return (
    <div className="viv-prep">
      <style>{PREP_CSS}</style>

      {/* Top Navigation matching Home, Form & Room Pages */}
      <header className="viv-nav">
        <a href="/" className="viv-brand" aria-label="Vivaro Home">
          <VivaroMark size={24} />
          <span>Vivaro</span>
        </a>
        <div className="viv-nav-actions">
          <a href="/interview" className="viv-nav-link">
            Mock interview
          </a>
          <a href="/" className="viv-nav-link">
            Home
          </a>
        </div>
      </header>

      {/* Main Stage */}
      <main className="viv-main">
        <div className="viv-badge">
          <span className="viv-badge-dot" aria-hidden="true" />
          <span>Interview Prep &amp; Skill-Gap Engine</span>
        </div>

        <h1 className="viv-title">
          Know what they&apos;ll <em>actually ask.</em>
        </h1>
        <p className="viv-sub">
          Upload your resume and paste the target job description. Vivaro generates the technical questions a real
          interviewer is most likely to probe—plus a tailored study roadmap.
        </p>

        {/* Ember Ridge Vista Frame + Floating Studio Cards */}
        <div className="viv-vista-wrap">
          <svg
            className="viv-vista-bg"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="viv-prep-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2c8a0" />
                <stop offset="70%" stopColor="#f6e2c8" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#viv-prep-sky)" />
            <path d="M0 900 L0 480 Q400 410 800 470 T1600 450 L1600 900 Z" fill="#d59b86" opacity="0.78" />
            <path d="M0 900 L0 570 Q450 510 900 575 T1600 540 L1600 900 Z" fill="#b9767a" opacity="0.86" />
            <path d="M0 900 L0 670 Q500 620 1000 680 T1600 650 L1600 900 Z" fill="#8a5868" />
            <path d="M0 900 L0 780 Q550 740 1100 790 T1600 765 L1600 900 Z" fill="#4f3646" />
          </svg>

          <img
            className="viv-vista-img"
            src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=72&w=2200"
            alt=""
            loading="eager"
          />
          <div className="viv-vista-shade" aria-hidden="true" />

          {/* Input Studio Card */}
          <div className="viv-card" role="region" aria-label="Prep Context Uploader">
            <div className="viv-card-head">
              <span className="viv-orb" aria-hidden="true" />
              <span className="viv-card-title">Prep Studio</span>
              <span className="viv-card-step">RESUME + JD</span>
            </div>

            <div className="viv-card-body">
              {/* Resume Upload */}
              <div className="viv-field">
                <div className="viv-field-head">
                  <label htmlFor="viv-prep-resume">Resume / CV (PDF)</label>
                  <span>Required</span>
                </div>

                {selectedFile ? (
                  <div className="viv-file">
                    <span className="viv-file-ico" aria-hidden="true">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 3h8l4 4v14H6z" />
                        <path d="M14 3v4h4" />
                      </svg>
                    </span>
                    <div className="viv-file-meta">
                      <b>{selectedFile.name}</b>
                      <span>PDF ready · {formatBytes(selectedFile.size)}</span>
                    </div>
                    <button
                      type="button"
                      className="viv-file-x"
                      onClick={clearFile}
                      disabled={questionsLoading}
                      aria-label="Remove resume"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="viv-prep-resume"
                    className={`viv-drop ${dragOver ? "is-over" : ""} ${questionsLoading ? "is-disabled" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (!questionsLoading) setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      if (!questionsLoading) handleFileChange(e.dataTransfer.files?.[0])
                    }}
                  >
                    <input
                      id="viv-prep-resume"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      disabled={questionsLoading}
                      className="viv-sr"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                    <span className="viv-drop-icons" aria-hidden="true">
                      <span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M6 3h8l4 4v14H6z" />
                          <path d="M14 3v4h4" />
                        </svg>
                      </span>
                      <em />
                      <span>
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
                        </svg>
                      </span>
                    </span>
                    <span>
                      Drag PDF resume here or <u>click to browse</u>
                    </span>
                  </label>
                )}
              </div>

              {/* Job Description Textarea */}
              <div className="viv-field">
                <div className="viv-field-head">
                  <label htmlFor="viv-prep-jd">Job Description</label>
                  <span>Role specs</span>
                </div>
                <textarea
                  id="viv-prep-jd"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job description here..."
                  rows={5}
                  disabled={questionsLoading}
                  className="viv-textarea"
                />
              </div>

              {/* CTA */}
              <button
                type="button"
                onClick={onSuggestQuestions}
                disabled={questionsLoading}
                className="viv-pill"
              >
                <span
                  className="viv-roll"
                  data-t={questionsLoading ? "Generating questions..." : "Suggest Interview Questions"}
                >
                  <span>{questionsLoading ? "Generating questions..." : "Suggest Interview Questions"}</span>
                </span>
              </button>
            </div>
          </div>

          {/* Generated Questions Studio Card */}
          {questions.length > 0 && (
            <div className="viv-card is-wide" role="region" aria-label="Likely Interview Questions">
              <div className="viv-card-head">
                <span className="viv-orb" aria-hidden="true" />
                <span className="viv-card-title">Likely Interview Questions</span>
                <span className="viv-card-step">{questions.length} QUESTIONS</span>
              </div>

              <div className="viv-card-body">
                <ol className="viv-q-list">
                  {questions.map((q, i) => (
                    <li key={i} className="viv-q-item">
                      <span className="viv-q-num">Q{String(i + 1).padStart(2, "0")}</span>
                      <p className="viv-q-text">{q}</p>
                    </li>
                  ))}
                </ol>

                <div className="viv-q-actions">
                  {resumeUploaded ? "" : ""}
                  {/* {resumeUploaded && !showRoadmap && (
                    <button
                      type="button"
                      onClick={() => setShowRoadmap(true)}
                      className="viv-pill is-accent"
                    >
                      <span className="viv-roll" data-t="Generate Study Roadmap">
                        <span>Generate Study Roadmap</span>
                      </span>
                    </button>
                  )} */}
                  <a href="/interview" className="viv-pill is-soft">
                    <span className="viv-roll" data-t="Practice Aloud in Voice Room">
                      <span>Practice Aloud in Voice Room</span>
                    </span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Study Roadmap Output */}
          {showRoadmap && (
            <div className="viv-roadmap-wrap">
              <StudyRoadmap jobDescription={jobDescription} resumeText={resumeText} transcript={null} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PrepPage













// import axios from "axios";
// import { useRef, useState } from "react";
// import { toast } from "sonner";
// import { StudyRoadmap } from "./StudyRoadmap";

// const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;


// export function PrepPage() {
//     const [jobDescription, setJobDescription] = useState("");
//     const [questionsLoading, setQuestionsLoading] = useState(false);
//     const [questions, setQuestions] = useState<string[]>([]);
//     const [resumeUploaded, setResumeUploaded] = useState(false);
//     const [showRoadmap, setShowRoadmap] = useState(false);
//     const [resumeText, setResumeText] = useState("");

//     const fileInputRef = useRef<HTMLInputElement>(null);

//     async function onSuggestQuestions() {
//         const file = fileInputRef.current?.files?.[0];

//         if (!file) {
//             toast.info("Upload your resume first", { position: "top-center" });
//             return;
//         }
//         if (!jobDescription.trim()) {
//             toast.info("Paste a job description first", { position: "top-center" });
//             return;
//         }

//         setQuestionsLoading(true);
//         setQuestions([]);
//         setShowRoadmap(false);

//         const formData = new FormData();
//         formData.append("resume", file);
//         formData.append("jobDescription", jobDescription.trim());

//         try {
//             const res = await axios.post(`${VITE_BACKEND_BASE_URL}/api/v1/prep/suggest-questions`, formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });

//             if (res.data?.success || res.data?.data) {
//                 setQuestions(res.data.data.questions);
//                 setResumeUploaded(true);
//                 setResumeText(res.data.data.resumeText);
//             }
//         } catch (err: any) {
//             const errorMsg = err.response?.data?.message || "Failed to generate questions. Please try again.";
//             toast.error(errorMsg);
//         } finally {
//             setQuestionsLoading(false);
//         }
//     }

//     return (
//         <section className="min-h-screen bg-[#F4F0E6] px-4 py-12">
//             <div className="max-w-xl mx-auto">

//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
//                         Interview prep
//                     </span>
//                     <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
//                         Know what they'll{" "}
//                         <span className="bg-[#F4D03F] px-2">actually ask.</span>
//                     </h1>
//                     <p className="text-gray-600 text-sm mt-3 max-w-sm mx-auto">
//                         Upload your resume and paste the job description. We'll generate
//                         the questions a real interviewer is most likely to ask you.
//                     </p>
//                 </div>

//                 {/* Input card */}
//                 <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
//                     <div className="flex flex-col gap-4">

//                         {/* Resume upload */}
//                         <div>
//                             <label className="text-xs font-semibold text-gray-500 mb-1 block">
//                                 Resume / CV <span className="text-gray-400 font-normal">(PDF)</span>
//                             </label>
//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept=".pdf"
//                                 onChange={() => {
//                                     setQuestions([]);
//                                     setResumeUploaded(false);
//                                     setShowRoadmap(false);
//                                 }}
//                                 className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-600
//                                            file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0
//                                            file:bg-[#F4D03F] file:text-black file:text-xs file:font-semibold
//                                            hover:file:bg-[#e8c52e]"
//                             />
//                         </div>

//                         {/* JD textarea */}
//                         <div>
//                             <label className="text-xs font-semibold text-gray-500 mb-1 block">
//                                 Job Description
//                             </label>
//                             <textarea
//                                 value={jobDescription}
//                                 onChange={(e) => setJobDescription(e.target.value)}
//                                 placeholder="Paste the full job description here..."
//                                 rows={6}
//                                 className="w-full border border-gray-300 text-black p-2.5 rounded-lg text-sm
//                                            focus:outline-none focus:ring-2 focus:ring-[#F4D03F]
//                                            focus:border-transparent resize-none"
//                             />
//                         </div>
//                     </div>

//                     {/* CTA */}
//                     <button
//                         onClick={onSuggestQuestions}
//                         disabled={questionsLoading}
//                         className="w-full mt-5 bg-black text-white font-semibold text-sm py-3
//                                    rounded-full hover:bg-gray-800 transition
//                                    disabled:opacity-60 disabled:cursor-not-allowed"
//                     >
//                         {questionsLoading ? "Generating questions..." : "Suggest Interview Questions"}
//                     </button>
//                 </div>

//                 {/* Questions output */}
//                 {questions.length > 0 && (
//                     <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

//                         <div className="flex items-center justify-between mb-5">
//                             <h2 className="text-base font-extrabold text-gray-900">
//                                 Likely Interview Questions
//                             </h2>
//                             <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                                 {questions.length} questions
//                             </span>
//                         </div>

//                         <ol className="space-y-3">
//                             {questions.map((q, i) => (
//                                 <li key={i} className="flex gap-3 items-start">
//                                     <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F4D03F] text-black
//                                                      text-xs font-bold flex items-center justify-center mt-0.5">
//                                         {i + 1}
//                                     </span>
//                                     <p className="text-sm text-gray-800 leading-relaxed">{q}</p>
//                                 </li>
//                             ))}
//                         </ol>

//                         {/* Divider + roadmap trigger */}
//                         <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
//                             <p className="text-xs text-gray-500 mb-3">
//                                 Want a personalised 4-week study plan based on your resume and this JD?
//                             </p>
//                             <button
//                                 onClick={() => setShowRoadmap(true)}
//                                 disabled={showRoadmap}
//                                 className="w-full bg-[#F4D03F] text-black font-semibold text-sm py-2.5
//                                            rounded-full hover:bg-[#e8c52e] transition
//                                            disabled:opacity-50 disabled:cursor-not-allowed"
//                             >
//                                 {showRoadmap ? "Roadmap loading below..." : "Generate Study Roadmap"}
//                             </button>
//                         </div>
//                     </div>
//                 )}

//                 {/* Study Roadmap View */}
//                 {showRoadmap && resumeUploaded && fileInputRef.current?.files?.[0] && (
//                     <div className="mt-6">
//                         <StudyRoadmap
//                             resumeText={resumeText} 
//                             jobDescription={jobDescription}
//                             transcript={null}
//                         />
//                     </div>
//                 )}

//             </div>
//         </section>
//     );
// }