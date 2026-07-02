import axios from "axios";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { BACKEND } from "../lib/config";
import { StudyRoadmap } from "./StudyRoadmap";

export function PrepPage() {
    const [jobDescription, setJobDescription] = useState("");
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [questions, setQuestions] = useState<string[]>([]);
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [showRoadmap, setShowRoadmap] = useState(false);
    const [resumeText, setResumeText] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function onSuggestQuestions() {
        const file = fileInputRef.current?.files?.[0];

        if (!file) {
            toast.info("Upload your resume first", { position: "top-center" });
            return;
        }
        if (!jobDescription.trim()) {
            toast.info("Paste a job description first", { position: "top-center" });
            return;
        }

        setQuestionsLoading(true);
        setQuestions([]);
        setShowRoadmap(false);

        const formData = new FormData();
        formData.append("resume", file);
        formData.append("jobDescription", jobDescription.trim());

        try {
            const res = await axios.post(`${BACKEND}/api/v1/prep/suggest-questions`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data?.success || res.data?.data) {
                setQuestions(res.data.data.questions);
                setResumeUploaded(true);
                setResumeText(res.data.data.resumeText);
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || "Failed to generate questions. Please try again.";
            toast.error(errorMsg);
        } finally {
            setQuestionsLoading(false);
        }
    }

    return (
        <section className="min-h-screen bg-[#F4F0E6] px-4 py-12">
            <div className="max-w-xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-4">
                        Interview prep
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Know what they'll{" "}
                        <span className="bg-[#F4D03F] px-2">actually ask.</span>
                    </h1>
                    <p className="text-gray-600 text-sm mt-3 max-w-sm mx-auto">
                        Upload your resume and paste the job description. We'll generate
                        the questions a real interviewer is most likely to ask you.
                    </p>
                </div>

                {/* Input card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="flex flex-col gap-4">

                        {/* Resume upload */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                Resume / CV <span className="text-gray-400 font-normal">(PDF)</span>
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".pdf"
                                onChange={() => {
                                    setQuestions([]);
                                    setResumeUploaded(false);
                                    setShowRoadmap(false);
                                }}
                                className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-600
                                           file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0
                                           file:bg-[#F4D03F] file:text-black file:text-xs file:font-semibold
                                           hover:file:bg-[#e8c52e]"
                            />
                        </div>

                        {/* JD textarea */}
                        <div>
                            <label className="text-xs font-semibold text-gray-500 mb-1 block">
                                Job Description
                            </label>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                rows={6}
                                className="w-full border border-gray-300 text-black p-2.5 rounded-lg text-sm
                                           focus:outline-none focus:ring-2 focus:ring-[#F4D03F]
                                           focus:border-transparent resize-none"
                            />
                        </div>
                    </div>

                    {/* CTA */}
                    <button
                        onClick={onSuggestQuestions}
                        disabled={questionsLoading}
                        className="w-full mt-5 bg-black text-white font-semibold text-sm py-3
                                   rounded-full hover:bg-gray-800 transition
                                   disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {questionsLoading ? "Generating questions..." : "Suggest Interview Questions"}
                    </button>
                </div>

                {/* Questions output */}
                {questions.length > 0 && (
                    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">

                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-base font-extrabold text-gray-900">
                                Likely Interview Questions
                            </h2>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                                {questions.length} questions
                            </span>
                        </div>

                        <ol className="space-y-3">
                            {questions.map((q, i) => (
                                <li key={i} className="flex gap-3 items-start">
                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#F4D03F] text-black
                                                     text-xs font-bold flex items-center justify-center mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-gray-800 leading-relaxed">{q}</p>
                                </li>
                            ))}
                        </ol>

                        {/* Divider + roadmap trigger */}
                        <div className="mt-6 pt-5 border-t border-dashed border-gray-200">
                            <p className="text-xs text-gray-500 mb-3">
                                Want a personalised 4-week study plan based on your resume and this JD?
                            </p>
                            <button
                                onClick={() => setShowRoadmap(true)}
                                disabled={showRoadmap}
                                className="w-full bg-[#F4D03F] text-black font-semibold text-sm py-2.5
                                           rounded-full hover:bg-[#e8c52e] transition
                                           disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {showRoadmap ? "Roadmap loading below..." : "Generate Study Roadmap"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Study Roadmap View */}
                {showRoadmap && resumeUploaded && fileInputRef.current?.files?.[0] && (
                    <div className="mt-6">
                        <StudyRoadmap
                            resumeText={resumeText} 
                            jobDescription={jobDescription}
                            transcript={null}
                        />
                    </div>
                )}

            </div>
        </section>
    );
}