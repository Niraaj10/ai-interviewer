import axios from "axios";
import { useRef, useState } from "react"
import { toast } from "sonner"
import { BACKEND } from "../../lib/config";
import { resume } from "react-dom/server";
import { useNavigate } from "@tanstack/react-router";

export function Form() {
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const fileInputRef = useRef<HTMLInputElement>(null);

    async function onSubmit() {
        if (!github) {
            toast.info("Provide valid github URLs", {
                position: 'top-center',
            })
            return;
        }

        const file = fileInputRef.current?.files?.[0]
        if (!file) {
            toast.info("Please upload your resume/cv", {
                position: 'top-center',
            })
            return;
        }


        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("github", github.trim());
            formData.append("resume", file);

            const res = await axios.post(`${BACKEND}/api/v1/pre-interview`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            // console.log("Server Response:", res.data);

            const interviewId = res.data.data.intId;

            // console.log("Extracted ID:", interviewId); 

            if (!interviewId) {
                throw new Error("No Interview ID received");
            }

            if (!res.data || !res.data.data.intId) {
                throw new Error("Server did not return a valid Interview ID");
            }

            navigate({
                to: '/interview/$interviewId',
                params: { interviewId }
            });

            setLoading(false);
        } catch (e) {
            toast.error("Something went wrong starting your interview. Please try again.")
            setLoading(false);
        }
    }



    return (
        <section className="flex flex-col items-center justify-center min-h-screen bg-[#F4F0E6] px-4">

            <span className="inline-block bg-black text-white text-xs font-semibold px-3 py-1 rounded-full mb-6">
                Built for Gen AI in education
            </span>

            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    AI Interview <span className="bg-[#F4D03F] px-2">Assistant</span>
                </h1>
                <p className="text-gray-600 text-sm mt-3 max-w-sm mx-auto">
                    Drop your GitHub profile and resume, and we'll start a voice-driven mock
                    interview tailored to your background.
                </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 w-full max-w-sm">
                <div className="flex flex-col gap-3">
                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            GitHub profile
                        </label>
                        <input
                            value={github}
                            placeholder="https://github.com/your-username"
                            onChange={(e) => setGithub(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
                            disabled={loading}
                            className="w-full border border-gray-300 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F4D03F] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            Resume / CV (PDF)
                        </label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            disabled={loading}
                            className="w-full border border-gray-300 p-2 rounded-lg text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#F4D03F] file:text-black file:text-xs file:font-semibold hover:file:bg-[#e8c52e] disabled:bg-gray-100 disabled:text-gray-400"
                        />
                    </div>
                </div>

                <button
                    disabled={loading}
                    className="w-full mt-5 bg-black text-white font-semibold text-sm py-3 rounded-full hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={onSubmit}>
                    {loading ? "Starting interview..." : "Start Interview"}
                </button>
            </div>

        </section>
    )
}