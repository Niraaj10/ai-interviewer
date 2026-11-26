import { useRef, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "@tanstack/react-router"

// const VITE_BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL
const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;



const FORM_CSS = `
.viv-int{
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
.viv-int *,.viv-int *::before,.viv-int *::after{box-sizing:border-box}

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
  font-size:clamp(42px,6.2vw,66px);
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
  margin:18px auto 0;
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
  margin-top:38px;
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
  mix-blend-mode:normal;
  pointer-events:none;
}
.viv-vista-shade{
  position:absolute;
  inset:0;
  background:linear-gradient(180deg,rgba(16,13,11,.14) 0%,rgba(16,13,11,.38) 100%);
  pointer-events:none;
}

/* Studio Card (Matches Home Page Canvas Card) */
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
  padding:20px 20px 22px;
  display:flex;
  flex-direction:column;
  gap:18px;
}

/* Form Inputs */
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
.viv-input-wrap{
  position:relative;
  display:flex;
  align-items:center;
}
.viv-input-ico{
  position:absolute;
  left:12px;
  color:var(--viv-card-mute);
  pointer-events:none;
  display:flex;
}
.viv-input{
  width:100%;
  height:42px;
  padding:0 12px 0 36px;
  border-radius:10px;
  border:0;
  background:var(--viv-card-soft);
  box-shadow:inset 0 0 0 1px var(--viv-card-line);
  font-size:13.5px;
  color:var(--viv-card-ink);
  outline:none;
  transition:box-shadow .2s,background-color .2s;
}
.viv-input::placeholder{color:var(--viv-faint)}
.viv-input:focus{
  background:#fff;
  box-shadow:inset 0 0 0 1.5px var(--viv-agent);
}
.viv-input:disabled{opacity:.55;cursor:not-allowed}

/* Drag & Drop Resume Zone (Matches Home Page Canvas Dropzone) */
.viv-drop{
  position:relative;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:10px;
  min-height:118px;
  padding:16px;
  border:1.5px dashed color-mix(in oklab,var(--viv-card-ink) 22%,transparent);
  border-radius:12px;
  background:var(--viv-card-soft);
  font-size:12.5px;
  color:var(--viv-card-mute);
  cursor:pointer;
  text-align:center;
  transition:border-color .25s,background-color .25s,transform .25s var(--viv-ease);
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

/* Primary Pill Button (Matches Home Page Roll Pill) */
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
  transition:transform .2s var(--viv-ease),background-color .25s,opacity .2s;
}
.viv-pill:hover:not(:disabled){background:#221c18}
.viv-pill:active:not(:disabled){transform:scale(.988)}
.viv-pill:disabled{opacity:.6;cursor:not-allowed}
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

/* Status & Assurances Footer inside Card */
.viv-note{
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  font:500 10.5px/1.3 var(--viv-mono);
  letter-spacing:.04em;
  text-transform:uppercase;
  color:var(--viv-card-mute);
  padding-top:4px;
}
.viv-note-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#16a34a;
  box-shadow:0 0 0 3px rgba(22,163,74,.2);
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

function formatBytes(n: number) {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`
  return `${(n / 1048576).toFixed(1)} MB`
}

function Mark({ size = 26 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.28),
        background:
          "radial-gradient(circle at 68% 72%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 45%), conic-gradient(from 335deg, #ff9a76, #ff85a1, #e09eff, #8ab4ff, #9ff0d5, #ffd38a, #ff9a76)",
        boxShadow: "0 1px 3px rgba(16,13,11,0.12), inset 0 0 0 1px rgba(16,13,11,0.08)",
        flex: "none",
      }}
    >
      <svg
        width={Math.round(size * 0.56)}
        height={Math.round(size * 0.56)}
        viewBox="0 0 16 16"
        style={{ position: "relative", zIndex: 1 }}
      >
        <path
          d="M4.2 13.5V2.5h4.6c2.4 0 4 1.4 4 3.6s-1.6 3.6-4 3.6H6.7v3.8H4.2zm2.5-5.7h1.9c1.1 0 1.7-.6 1.7-1.7s-.6-1.7-1.7-1.7H6.7v3.4z"
          fill="#100d0b"
        />
      </svg>
    </span>
  )
}

export function Form() {
  const [github, setGithub] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(file: File | undefined) {
    if (!file) return
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      toast.info("Please upload a valid PDF resume", {
        position: "top-center",
      })
      return
    }
    setSelectedFile(file)
  }

  function clearFile() {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  async function onSubmit() {
    if (!github.trim()) {
      toast.info("Provide valid github URLs", {
        position: "top-center",
      })
      return
    }

    const file = selectedFile || fileInputRef.current?.files?.[0]
    if (!file) {
      toast.info("Please upload your resume/cv", {
        position: "top-center",
      })
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("github", github.trim())
      formData.append("resume", file)

      const res = await axios.post(`${VITE_BACKEND_BASE_URL}/api/v1/pre-interview`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const interviewId = res.data?.data?.intId

      if (!interviewId) {
        throw new Error("Server did not return a valid Interview ID")
      }

      navigate({
        to: "/interview/$interviewId",
        params: { interviewId },
      })

      setLoading(false)
    } catch (e) {
      toast.error("Something went wrong starting your interview. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="viv-int">
      <style>{FORM_CSS}</style>

      {/* Top Navigation matching Home Page */}
      <header className="viv-nav">
        <a href="/" className="viv-brand" aria-label="Vivaro Home">
          <Mark size={24} />
          <span>Vivaro</span>
        </a>
        <div className="viv-nav-actions">
          <a href="/prep" className="viv-nav-link">
            Plan study
          </a>
          <a href="/" className="viv-nav-link">
            Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="viv-main">
        <div className="viv-badge">
          <span className="viv-badge-dot" aria-hidden="true" />
          <span>Built for Gen AI in education</span>
        </div>

        <h1 className="viv-title">
          AI Interview <em>Assistant</em>
        </h1>
        <p className="viv-sub">
          Drop your GitHub profile and resume, and we&apos;ll start a voice-driven mock interview tailored to your
          background.
        </p>

        {/* Ember Ridge Vista Frame + Floating Studio Card */}
        <div className="viv-vista-wrap">
          {/* Ember Ridge Fallback SVG matching Home Page palette="ember" */}
          <svg
            className="viv-vista-bg"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="viv-ember-sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f2c8a0" />
                <stop offset="70%" stopColor="#f6e2c8" />
              </linearGradient>
            </defs>
            <rect width="1600" height="900" fill="url(#viv-ember-sky)" />
            <path d="M0 900 L0 480 Q400 410 800 470 T1600 450 L1600 900 Z" fill="#d59b86" opacity="0.78" />
            <path d="M0 900 L0 570 Q450 510 900 575 T1600 540 L1600 900 Z" fill="#b9767a" opacity="0.86" />
            <path d="M0 900 L0 670 Q500 620 1000 680 T1600 650 L1600 900 Z" fill="#8a5868" />
            <path d="M0 900 L0 780 Q550 740 1100 790 T1600 765 L1600 900 Z" fill="#4f3646" />
          </svg>

          <img
            className="viv-vista-img"
            src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&q=72&w=2200"
            alt=""
            loading="eager"
          />
          <div className="viv-vista-shade" aria-hidden="true" />

          {/* Interview Studio Card */}
          <div className="viv-card" role="region" aria-label="Interview Setup">
            <div className="viv-card-head">
              <span className="viv-orb" aria-hidden="true" />
              <span className="viv-card-title">Session Setup</span>
              <span className="viv-card-step">01 / 02</span>
            </div>

            <div className="viv-card-body">
              {/* GitHub Profile Field */}
              <div className="viv-field">
                <div className="viv-field-head">
                  <label htmlFor="viv-github">GitHub profile</label>
                  <span>Public repos</span>
                </div>
                <div className="viv-input-wrap">
                  <span className="viv-input-ico" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                  </span>
                  <input
                    id="viv-github"
                    className="viv-input"
                    value={github}
                    placeholder="https://github.com/your-username"
                    onChange={(e) => setGithub(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Resume / CV Dropzone */}
              <div className="viv-field">
                <div className="viv-field-head">
                  <label htmlFor="viv-resume">Resume / CV (PDF)</label>
                  <span>Max 10 MB</span>
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
                      disabled={loading}
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
                    htmlFor="viv-resume"
                    className={`viv-drop ${dragOver ? "is-over" : ""} ${loading ? "is-disabled" : ""}`}
                    onDragOver={(e) => {
                      e.preventDefault()
                      if (!loading) setDragOver(true)
                    }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault()
                      setDragOver(false)
                      if (!loading) handleFileChange(e.dataTransfer.files?.[0])
                    }}
                  >
                    <input
                      id="viv-resume"
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf"
                      disabled={loading}
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
                          <rect x="9" y="3" width="6" height="11" rx="3" />
                          <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
                        </svg>
                      </span>
                    </span>
                    <span>
                      Drag PDF resume here or <u>click to browse</u>
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button type="button" disabled={loading} className="viv-pill" onClick={onSubmit}>
                <span
                  className="viv-roll"
                  data-t={loading ? "Starting interview..." : "Start Interview"}
                >
                  <span>{loading ? "Starting interview..." : "Start Interview"}</span>
                </span>
              </button>

              <div className="viv-note">
                <span className="viv-note-dot" aria-hidden="true" />
                <span>WebRTC voice room · Instant rubric scorecard</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Form


// import axios from "axios";
// import { useRef, useState } from "react"
// import { toast } from "sonner"
// import { useNavigate } from "@tanstack/react-router";

// // const VITE_BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL; // Main deplyed
// const VITE_BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// export function Form() {
//     const [github, setGithub] = useState("");
//     const [loading, setLoading] = useState(false);
//     const navigate = useNavigate()

//     const fileInputRef = useRef<HTMLInputElement>(null);

//     async function onSubmit() {
//         if (!github) {
//             toast.info("Provide valid github URLs", {
//                 position: 'top-center',
//             })
//             return;
//         }

//         const file = fileInputRef.current?.files?.[0]
//         if (!file) {
//             toast.info("Please upload your resume/cv", {
//                 position: 'top-center',
//             })
//             return;
//         }


//         setLoading(true);

//         try {
//             const formData = new FormData();
//             formData.append("github", github.trim());
//             formData.append("resume", file);

//             const res = await axios.post(`${VITE_BACKEND_BASE_URL}/api/v1/pre-interview`, formData, {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             });

//             // console.log("Server Response:", res.data);

//             const interviewId = res.data.data.intId;

//             // console.log("Extracted ID:", interviewId); 

//             if (!interviewId) {
//                 throw new Error("No Interview ID received");
//             }

//             if (!res.data || !res.data.data.intId) {
//                 throw new Error("Server did not return a valid Interview ID");
//             }

//             navigate({
//                 to: '/interview/$interviewId',
//                 params: { interviewId }
//             });

//             setLoading(false);
//         } catch (e) {
//             toast.error("Something went wrong starting your interview. Please try again.")
//             setLoading(false);
//         }
//     }



//     return (
//         <section className="flex flex-col items-center justify-center min-h-screen bg-[#F4F0E6] px-4">

//             <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
//                 Built for Gen AI in education
//             </span>

//             <div className="text-center mb-8">
//                 <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
//                     AI Interview <span className="bg-[#F4D03F] px-2">Assistant</span>
//                 </h1>
//                 <p className="text-gray-600 text-sm mt-3 max-w-sm mx-auto">
//                     Drop your GitHub profile and resume, and we'll start a voice-driven mock
//                     interview tailored to your background.
//                 </p>
//             </div>

//             <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-full max-w-sm">
//                 <div className="flex flex-col gap-3">
//                     <div>
//                         <label className="text-xs font-semibold text-gray-500 mb-1 block">
//                             GitHub profile
//                         </label>
//                         <input
//                             value={github}
//                             placeholder="https://github.com/your-username"
//                             onChange={(e) => setGithub(e.target.value)}
//                             onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
//                             disabled={loading}
//                             className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D03F] focus:border-transparent text-black disabled:bg-gray-100 disabled:text-gray-400"
//                         />
//                     </div>

//                     <div>
//                         <label className="text-xs font-semibold text-gray-500 mb-1 block">
//                             Resume / CV (PDF)
//                         </label>
//                         <input
//                             ref={fileInputRef}
//                             type="file"
//                             accept=".pdf"
//                             disabled={loading}
//                             className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#F4D03F] file:text-black file:text-xs file:font-semibold hover:file:bg-[#e8c52e] disabled:bg-gray-100 disabled:text-gray-400"
//                         />
//                     </div>
//                 </div>

//                 <button
//                     disabled={loading}
//                     className="w-full mt-5 bg-black text-white font-semibold text-sm py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
//                     onClick={onSubmit}>
//                     {loading ? "Starting interview..." : "Start Interview"}
//                 </button>
//             </div>

//         </section>
//     )
// }