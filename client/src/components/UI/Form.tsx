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
       if(!github) {
            toast.info("Provide valid github URLs",{
                position: 'top-center',
            })
            return;
       }

       const file = fileInputRef.current?.files?.[0]
       if (!file) {
            toast.info("Please upload your resume/cv",{
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
        
        navigate({ to: '/interview' })
        setLoading(false);
       } catch (e) {
        toast.error("Something went wrong starting your interview. Please try again.")
        setLoading(false);
       }
    }



    return (
        <section className="flex flex-col items-center justify-center h-screen">

            <div>
                <h1>AI Interview Assistant</h1>
            </div>

            <div className="flex flex-col items-center justify-center gap-3 w-30%">
                <input
                    value={github}
                    placeholder="https://github.com/your-username"
                    onChange={(e) => setGithub(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !loading && onSubmit()}
                    disabled={loading}
                    className="border-2 border-gray-300 p-2 rounded-md"
                />
                
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    disabled={loading}
                    className="border-2 border-gray-300 p-2 rounded-md"
                />
                
            </div>

            <div className="flex flex-col items-center justify-center mt-5">
                <button 
                disabled={loading}
                className="bg-black text-white p-2 rounded-md"
                onClick={onSubmit}>
                    {loading ? "starting Interview..." : "Start Interview"}
                </button>
            </div>

        </section>
    )
}