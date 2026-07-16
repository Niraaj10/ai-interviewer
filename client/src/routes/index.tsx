import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon } from 'lucide-react';
import { useState } from "react";


function PaperDoodle({ className, rotate = 0 } : { className?: string, rotate?: number} ) {
  return (
    <svg
      viewBox="0 0 90 90"
      className={className}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <path
        d="M12 8 L70 4 L82 20 L78 78 L14 84 L8 22 Z"
        fill="#fdfdf8"
        stroke="#1c2b17"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="24" r="1.8" fill="#1c2b17" />
      <path d="M30 23 h30" stroke="#1c2b17" strokeWidth="1.5" />
      <path d="M22 34 q10 -6 18 0 t18 0" stroke="#1c2b17" strokeWidth="1.5" fill="none" />
      <circle cx="22" cy="46" r="1.8" fill="#1c2b17" />
      <path d="M30 45 h28" stroke="#1c2b17" strokeWidth="1.5" />
      <path d="M20 58 q12 8 24 0 t24 0" stroke="#1c2b17" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const footerCols = ["Company", "Quick Links", "Industry"];
  const footerLinks = ["About Us", "Carees", "Contact", "Community", "Testimonials"];
  const navLinks = ["AI Interview", "Features", "For Businesses", "For Recruiters", "Pricing"];
  const logos = ["stripe", "HubSpot", "coinbase", "Google", "GLASSDOOR"];



  return (
    <>
      <div className="min-h-screen bg-[#F4F0E6] text-gray-900">
        {/* Nav */}
        <div className="bg-[#f7f4e8] font-sans min-h-screen">
          <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#F4D03F] flex items-center justify-center">
                <span className="text-black font-bold text-sm">V</span>
              </div>
              <span className="font-bold text-lg">Vivaro</span>
            </div>

            {/* <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
            <a href="#features" className="hover:text-black">Features</a>
            <a href="#how-it-works" className="hover:text-black">How it works</a>
            <a href="#roadmap" className="hover:text-black">Roadmap</a>
            <a href="#pilot" className="hover:text-black">Pilot study</a>
          </div> */}

            <div className="hidden md:flex items-center gap-4">
              {/* <a href="#login" className="text-sm font-medium text-gray-700 hover:text-black">Log in</a> */}
              <a
                href="/interview"
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



          {/* HERO */}
          <div className="relative max-w-4xl mx-auto text-center pt-16 pb-10 px-6">

            <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
              {/* Built for Gen AI in education */}
              For students and job seekers
            </span>

            {/* doodles */}
            <PaperDoodle className="hidden md:block absolute left-0 top-32 w-24 h-24" rotate={-8} />
            <PaperDoodle className="hidden md:block absolute left-24 top-72 w-20 h-20" rotate={-14} />
            <PaperDoodle className="hidden md:block absolute right-8 top-56 w-24 h-24" rotate={10} />

            <h1 className="max-w-2xl mx-auto text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
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
              href="/prep"
              className="bg-black text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-gray-800 transition"
            >
              Plan your study
            </a>
            <a
              href="/interview"
              className="border border-gray-300 font-semibold text-sm px-6 py-3 rounded-full hover:border-gray-400 transition"
            >
              Take mock Interview 
            </a>
          </div>

            <div className="flex items-center justify-center gap-6 text-[#1c2b17]/60 text-sm">
              <span className="text-xs uppercase tracking-wide">Trusted by Students:</span>
              {logos.map((logo) => (
                <span key={logo} className="font-semibold text-[#1c2b17]/70">
                  {logo}
                </span>
              ))}
            </div>
          </div>

          {/* VIDEO / IMAGE CARD */}
          <div className="max-w-4xl mx-auto px-6 pb-16">
            <div className="relative rounded-3xl border-8 border-[#c9531f] overflow-hidden aspect-video bg-black">
              <img
                src="https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=1200&q=80"
                alt="Person recording a podcast interview"
                className="w-full h-full object-cover"
              />
              <button
                aria-label="Play video"
                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 rounded-xl bg-black/70 flex items-center justify-center hover:bg-black/80 transition"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
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
            href="/interview"
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
        <div className="bg-[#e7e6e0] p-6 font-sans">
          <div className=" mx-auto bg-[#f7f4e8] rounded-3xl overflow-hidden relative">

            {/* HERO */}
            <div className="p-10">
              <div className="relative overflow-hidden bg-[#f4dd4d] rounded-[20px] flex items-center justify-between px-14 py-12">

                <div className="max-w-md z-10">
                  <h1 className="text-4xl font-bold text-[#1c2b17] leading-tight mb-4">
                    Prepare students for career success.
                  </h1>
                  <p className="text-sm text-[#2c3a25] leading-relaxed mb-6">
                    Transform your career services with our AI interviewer platform.
                    Give every student unlimited practice with AI interview technology
                    that provides personalized feedback and builds real confidence.
                  </p>
                  <button className="bg-[#1c2b17] text-[#f4dd4d] rounded-lg px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
                    It's Free Try Now!
                  </button>
                </div>

                {/* Illustration */}
                <svg width="220" height="200" viewBox="0 0 220 200" className="z-10 shrink-0">
                  <g stroke="#1c2b17" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="10" y="150" width="30" height="35" />
                    <rect x="55" y="120" width="30" height="65" />
                    <rect x="100" y="90" width="30" height="95" />
                    <line x1="165" y1="70" x2="165" y2="35" strokeDasharray="4 5" />
                    <path d="M165 10 L171 25 L187 26 L174 36 L179 51 L165 42 L151 51 L156 36 L143 26 L159 25 Z" />
                    <circle cx="115" cy="45" r="9" />
                    <path d="M115 54 L115 78" />
                    <path d="M115 60 L98 70" />
                    <path d="M115 60 L132 50" />
                    <rect x="122" y="48" width="14" height="12" rx="1" transform="rotate(20 122 48)" />
                    <path d="M115 78 L100 95" />
                    <path d="M115 78 L128 92" />
                  </g>
                </svg>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-14 pb-10">

              <div className="flex flex-wrap justify-between items-start gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-[46px] h-[46px] bg-[#f4dd4d] rounded-[10px] flex items-center justify-center font-bold text-2xl text-[#1c2b17]">
                    S
                  </div>
                  <span className="text-2xl font-bold text-[#1c2b17]">Vivaro</span>
                </div>

                <div className="min-w-[260px]">
                  <p className="text-sm font-semibold text-[#1c2b17] mb-2.5">Sign up to our news letter</p>
                  <div className="flex gap-2.5">
                    <input
                      placeholder="Email"
                      className="flex-1  border-[#1c2b17] bg-transparent px-1 py-1.5 text-sm outline-none text-[#1c2b17] placeholder:text-[#1c2b17]/60"
                    />
                    <button className="bg-[#1c2b17] text-[#f4dd4d] rounded-md px-4.5 py-2 text-sm font-semibold whitespace-nowrap hover:opacity-90 transition">
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between items-center gap-3 text-xs text-[#1c2b17]">
                <div className="flex gap-5">
                  <span>Terms of use</span>
                  <span>Privacy Policy</span>
                </div>
                <div className="flex items-center gap-5">
                  <span>
                    Contact Us <strong>support@Vivaro.ai</strong>
                  </span>
                  <div className="flex gap-3 text-base">
                    <span>in</span>
                    <span>𝕏</span>
                    <span></span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#1c2b17] my-5" />

              <div className="flex flex-wrap justify-between gap-6">
                {footerCols.map((col) => (
                  <div key={col}>
                    <p className="text-[13px] font-bold text-[#1c2b17] mb-2.5">{col}</p>
                    {footerLinks.map((item) => (
                      <p key={item} className="text-xs text-[#1c2b17] my-1.5">
                        {item}
                      </p>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* GIANT WORDMARK, cropped at bottom */}
            <div className="text-center font-extrabold text-[#1c2b17] leading-none select-none text-[450px] mt-[-200px] tracking-tighter translate-y-[30%]">
              Vivaro
            </div>
          </div>
        </div>

      </div>

    </>
  )
}
