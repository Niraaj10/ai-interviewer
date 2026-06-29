import { createFileRoute } from '@tanstack/react-router'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND } from '../../../lib/config';

export const Route = createFileRoute('/interview/$interviewId/summary')({
  component: RouteComponent,
})

function RouteComponent() {
  const { interviewId } = Route.useParams();
    const [report, setReport] = useState<{ score: number | null; feedback: string | null } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportCard = async () => {
            try {
                const res = await axios.get(`${BACKEND}/api/v1/interview/${interviewId}`);
                console.log("Response Data Container:", res.data);
    
                if (res.data && res.data.success) {
                    const interviewPayload = res.data.data; 
                    
                    setReport({ 
                        score: interviewPayload.score,
                        feedback: interviewPayload.feedback 
                    });
                }
            } catch (err) {
                console.error("Could not pull scorecard arrays:", err);
            } finally {
                setLoading(false);
            }
        };
        
        if (interviewId) {
            fetchReportCard();
        }
    }, [interviewId]);

    if (loading) return <div className="p-12 text-center animate-pulse font-medium">Analyzing interview metrics...</div>;

    if (!report || report.score === null) {
        return (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white border border-gray-100 shadow-xl rounded-2xl text-center">
                <h3 className="text-xl font-bold mb-2">Compiling Evaluation...</h3>
                <p className="text-sm text-gray-500 mb-6">Gemini is finishing the technical scoring transcript calculations.</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium">
                    Refresh Scorecard
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto mt-16 p-8 bg-white border border-gray-100 shadow-2xl rounded-3xl">
            <div className="text-center mb-8">
                <span className="text-xs tracking-widest uppercase font-bold text-gray-400">Official Evaluation Report</span>
                <h2 className="text-3xl font-black mt-1 text-gray-900">Performance Scorecard</h2>
            </div>
            
            <div className="flex justify-center mb-8">
                <div className="w-32 h-32 rounded-full border-4 border-black flex flex-col items-center justify-center shadow-inner bg-gray-50">
                    <span className="text-4xl font-black text-gray-950">{report.score}</span>
                    <span className="text-xs font-bold text-gray-400">/ 100</span>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                <h4 className="text-sm font-bold tracking-wider text-gray-400 uppercase mb-3">Interviewer Feedback</h4>
                <p className="text-gray-700 leading-relaxed text-sm font-medium whitespace-pre-line">{report.feedback}</p>
            </div>
        </div>
    );
}
