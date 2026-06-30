import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon } from 'lucide-react';
import {useState} from "react";


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
 
    
    
    return (
        <>
      <div className="min-h-screen bg-[#F4F0E6] text-gray-900">
        {/* Nav */}
        <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F4D03F] flex items-center justify-center">
              <span className="text-black font-bold text-sm">V</span>
            </div>
            <span className="font-bold text-lg">Vivaro</span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#how-it-works" className="hover:text-black">How it works</a>
            <a href="#roadmap" className="hover:text-black">Roadmap</a>
            <a href="#pilot" className="hover:text-black">Pilot study</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a href="#login" className="text-sm font-medium text-gray-700 hover:text-black">Log in</a>
            <a
              href="#try"
              className="text-sm font-semibold bg-[#F4D03F] text-black px-5 py-2.5 rounded-full hover:bg-[#e8c52e] transition"
            >
              Try for free
            </a>
          </div>

          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 flex flex-col gap-3 text-sm font-medium">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it works</a>
            <a href="#roadmap">Roadmap</a>
            <a href="#pilot">Pilot study</a>
            <a href="#try" className="bg-[#F4D03F] text-black px-5 py-2.5 rounded-full text-center font-semibold">
              Try for free
            </a>
          </div>
        )}

        {/* Hero */}
        <header className="max-w-2xl mx-auto px-6 pt-10 pb-12 text-center">
          <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
            Built for Gen AI in education
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            AI interviewer for your{" "}
            <span className="bg-[#F4D03F] px-2">dream tech role.</span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base max-w-lg mx-auto mb-8">
            Run real voice-driven mock interviews, compare your resume against any job
            description, and get a scored, actionable feedback report, all in one
            low-latency session.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-4">
            <a
              href="#try"
              className="bg-black text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Practice For Free
            </a>
            <a
              href="#how-it-works"
              className="border border-gray-300 font-semibold text-sm px-6 py-3 rounded-full hover:border-gray-400 transition"
            >
              Get Vivaro Today
            </a>
          </div>

          <p className="text-xs text-gray-400">
            Trusted by students &nbsp;·&nbsp; PERN stack &nbsp;·&nbsp; LiveKit &nbsp;·&nbsp; Gemini Live &nbsp;·&nbsp; 2026 pilot
          </p>
        </header>

        {/* Hero visual */}
        <div className="max-w-3xl mx-auto px-6 mb-24">
          <div className="rounded-2xl border-4 border-[#D2541E] overflow-hidden bg-gray-900 aspect-video relative">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="flex items-end justify-center gap-1.5 h-12 mb-4">
                  {[14, 28, 38, 22, 30, 16].map((h, i) => (
                    <div
                      key={i}
                      className="w-2.5 bg-white rounded-full"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-300">AI interviewer is listening...</p>
              </div>
            </div>
            <button
              className="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-14 h-14 rounded-full bg-white/90 flex items-center justify-center"
              aria-label="Play demo"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Are you preparing section */}
        <section id="how-it-works" className="max-w-2xl mx-auto px-6 text-center mb-16">
          <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
            For students and job seekers
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Are you preparing for a job switch or new opportunities?
          </h2>
          <p className="text-gray-600 text-sm max-w-lg mx-auto mb-8">
            Configure custom interview questions, get a semantic skill-gap analysis
            against any job description, and evaluate every session fairly while focusing
            your time on what matters.
          </p>
          <a
            href="#try"
            className="inline-block bg-[#F4D03F] text-black font-semibold text-sm px-6 py-3 rounded-full hover:bg-[#e8c52e] transition"
          >
            Try For Free
          </a>
        </section>

        {/* Feature 1: Practice interviews - yellow card */}
        <section id="features" className="max-w-5xl mx-auto px-6 mb-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-extrabold mb-4">
                Practice interviews with AI on any job role or subject
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <CheckIcon /> Access comprehensive interview scenarios across web
                  dev, databases, and system design
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> Simulate interviews for both entry-level and
                  advanced engineering roles
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> Adjust interview settings to match your target job
                  description
                </li>
              </ul>
            </div>
            <div className="bg-[#F4D03F] rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-4">
                <p className="text-xs font-semibold text-gray-400 mb-3">Welcome Vivek</p>
                <div className="flex gap-2 mb-3">
                  <span className="text-[11px] bg-black text-white px-3 py-1 rounded-full">Job</span>
                  <span className="text-[11px] text-gray-500 px-3 py-1">Topic</span>
                  <span className="text-[11px] text-gray-500 px-3 py-1">Resume</span>
                </div>
                <p className="text-sm text-gray-800 mb-3">
                  "We are seeing a stateless and creative individual to join our
                  frontend team."
                </p>
                <div className="flex items-end gap-1 h-8">
                  {[6, 14, 20, 10, 16, 8].map((h, i) => (
                    <div key={i} className="w-1.5 bg-gray-800 rounded-full" style={{ height: `${h}px` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="max-w-5xl mx-auto border-dashed border-gray-300 my-10" />

        {/* Feature 2: Scoring & feedback - purple card */}
        <section className="max-w-5xl mx-auto px-6 mb-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="bg-[#C9B8F0] rounded-2xl p-6 aspect-[4/3] flex items-center justify-center order-2 md:order-1">
              <div className="bg-[#0F2A24] rounded-xl shadow-lg w-full max-w-xs p-4">
                <p className="text-xs font-semibold text-gray-300 mb-4">Score Report</p>
                <div className="flex items-center justify-center mb-2">
                  <div className="relative w-20 h-20 rounded-full border-8 border-gray-700 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-8 border-[#7DD3C0] border-r-transparent border-b-transparent rotate-45" />
                    <span className="text-lg font-bold text-white">22.6/10</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl font-extrabold mb-4">
                Learn from instant feedback and example answers
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <CheckIcon /> Receive immediate feedback on your responses, scored
                  against a real rubric
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> Access example answers for comparison against your
                  own transcript
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> Enhance your performance constructively with
                  actionable insights
                </li>
              </ul>
            </div>
          </div>
        </section>

        <hr className="max-w-5xl mx-auto border-dashed border-gray-300 my-10" />

        {/* Feature 3: Resume optimization - teal card */}
        <section className="max-w-5xl mx-auto px-6 mb-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-2xl font-extrabold mb-4">
                Optimize your resume with AI interviewer technology better
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex gap-2">
                  <CheckIcon /> ATS score checker to evaluate resume visibility
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> AI-powered resume feedback with keyword optimization
                </li>
                <li className="flex gap-2">
                  <CheckIcon /> Job match analysis to target specific positions
                </li>
              </ul>
            </div>
            <div className="bg-[#7DD3C0] rounded-2xl p-6 aspect-[4/3] flex items-center justify-center">
              <div className="bg-white rounded-xl shadow-lg w-full max-w-xs p-4 space-y-2">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-semibold text-gray-400">Fixed Skills</p>
                  <span className="text-[10px] text-gray-400">Show All</span>
                </div>
                {[
                  ["React", 82],
                  ["System design", 54],
                  ["SQL", 70],
                ].map(([label, pct]) => (
                  <div key={label}>
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>{label}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full">
                      <div
                        className="h-1.5 bg-[#7DD3C0] rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pilot study / CTA */}
        <section id="pilot" className="max-w-2xl mx-auto px-6 text-center mb-20">
          <h2 className="text-3xl font-extrabold mb-4">Now piloting with engineering students</h2>
          <p className="text-gray-600 text-sm mb-8 max-w-lg mx-auto">
            We're running a pilot with 15–20 engineering students to measure feedback
            accuracy, scorecard consistency, and resume match quality. If your placement
            cell wants high-fidelity mock interviews without the staffing problem, we'd
            like to talk.
          </p>
          <a
            href="#contact"
            className="inline-block bg-black text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition"
          >
            Bring Vivaro to your campus
          </a>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <span>Vivaro</span>
            <span>Built for students preparing for technical interviews</span>
          </div>
        </footer>
      </div>

    </>
  )
}
