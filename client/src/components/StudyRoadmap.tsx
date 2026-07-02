import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND } from "../lib/config";

interface Gap {
    area: string;
    reason: string;
    priority: "high" | "medium" | "low";
}

interface WeekPlan {
    week: number;
    focus: string;
    topics: string[];
    resources: string[];
}

interface RoadmapData {
    summary: string;
    gaps: Gap[];
    roadmap: WeekPlan[];
}

interface StudyRoadmapProps {
    resumeText: string;
    jobDescription: string;
    transcript: string | null; // null = no interview yet (pre-interview mode)
}

const priorityColors: Record<string, string> = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
};

const weekColors = ["bg-[#F4D03F]", "bg-[#C9B8F0]", "bg-[#7DD3C0]", "bg-orange-200"];

export function StudyRoadmap({ resumeText, jobDescription, transcript }: StudyRoadmapProps) {
    const [data, setData] = useState<RoadmapData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchRoadmap() {
            setLoading(true);
            setError(null);
            try {
                const res = await axios.post(`${BACKEND}/api/v1/study-roadmap`, {
                    resumeText,
                    jobDescription,
                    transcript: transcript ?? "",
                });
                setData(res.data.data.roadmap);
            } catch {
                setError("Failed to generate roadmap. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchRoadmap();
    }, [resumeText, jobDescription, transcript]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4" />
                <p className="text-sm text-gray-500 animate-pulse">
                    {transcript
                        ? "Analysing your resume, JD, and interview transcript..."
                        : "Comparing your resume against the job description..."}
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-2xl border border-red-200 shadow-lg p-6 text-center">
                <p className="text-sm text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">

            {/* Header */}
            <div className="bg-black px-6 py-5">
                <span className="inline-block bg-[#F4D03F] text-black text-xs font-semibold px-3 py-1 rounded-full mb-2">
                    {transcript ? "Post-interview roadmap" : "Pre-interview roadmap"}
                </span>
                <h2 className="text-white font-extrabold text-lg">Personalised Study Roadmap</h2>
                <p className="text-gray-400 text-sm mt-1">{data.summary}</p>
            </div>

            <div className="p-6 space-y-6">

                {/* Skill gaps */}
                <div>
                    <h3 className="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wider">
                        Identified Gaps
                    </h3>
                    <div className="space-y-2">
                        {data.gaps.map((gap, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
                            >
                                <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 uppercase ${priorityColors[gap.priority]}`}
                                >
                                    {gap.priority}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800">{gap.area}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{gap.reason}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly roadmap */}
                <div>
                    <h3 className="text-sm font-extrabold text-gray-900 mb-3 uppercase tracking-wider">
                        {data.roadmap.length}-Week Study Plan
                    </h3>
                    <div className="space-y-3">
                        {data.roadmap.map((week, i) => (
                            <div key={i} className="rounded-xl overflow-hidden border border-gray-100">
                                {/* Week header */}
                                <div className={`${weekColors[i % weekColors.length]} px-4 py-2.5 flex items-center gap-2`}>
                                    <span className="text-xs font-bold text-black bg-black/10 px-2 py-0.5 rounded-full">
                                        Week {week.week}
                                    </span>
                                    <span className="text-sm font-extrabold text-gray-900">{week.focus}</span>
                                </div>

                                {/* Topics + resources */}
                                <div className="px-4 py-3 bg-white grid sm:grid-cols-2 gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                            Topics
                                        </p>
                                        <ul className="space-y-1">
                                            {week.topics.map((t, j) => (
                                                <li key={j} className="flex items-start gap-1.5">
                                                    <span className="text-[#F4D03F] font-bold text-xs mt-0.5">▸</span>
                                                    <span className="text-xs text-gray-700">{t}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                                            Resources
                                        </p>
                                        <ul className="space-y-1">
                                            {week.resources.map((r, j) => (
                                                <li key={j} className="flex items-start gap-1.5">
                                                    <span className="text-gray-400 text-xs mt-0.5">→</span>
                                                    <span className="text-xs text-gray-700">{r}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}