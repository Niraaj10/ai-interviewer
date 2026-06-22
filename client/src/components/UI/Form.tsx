import { useState } from "react"
import { toast } from "sonner"

export function Form() {
    const [github, setGithub] = useState("");
    // const [linkedin, setLinkedin] = useState("");
    const [loading, setLoading] = useState(false);

    async function onSubmit() {
       
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
                {/* <input type="text" name="linkedin" placeholder="Linkedin URL" className="border-2 border-gray-300 p-2 rounded-md" /> */}
            </div>

            <div className="flex flex-col items-center justify-center mt-5">
                <button className="bg-black text-white p-2 rounded-md">Start Interview</button>
            </div>

        </section>
    )
}