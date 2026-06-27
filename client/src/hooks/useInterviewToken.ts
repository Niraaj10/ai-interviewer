import axios from "axios";
import { useCallback, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

export function useInterviewToken() {
    // ✅ Type inferred automatically from initial state (null) and usage
    const [connectionDetails, setConnectionDetails] = useState<{
        token: string;
        serverUrl: string;
        roomName: string;
    } | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchToken = useCallback(async (interviewId: string) => {
        setIsLoading(true);
        setError(null);
    
        try {
            const res = await axios.post(
                `${BACKEND_URL}/api/v1/interview/token`, 
                { interviewId }, 
                { 
                    headers: { 
                        "Content-Type": "application/json"
                    } 
                }
            );
    
            const payload = res.data; 
            console.log("Token response:", payload);
    
            if (!payload.data || !payload.data.token) {
                throw new Error("Invalid response structure from server");
            }
            console.log("token :", payload.data.token);
    
            setConnectionDetails({
                token: payload.data.token,
                roomName: payload.data.roomName,
                serverUrl: payload.data.serverUrl
            });

        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to fetch interview token";
            setError(message);
            console.error("Token fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [BACKEND_URL]); // ✅ Added dependency

    // ✅ Return types inferred automatically
    return { connectionDetails, isLoading, error, fetchToken };
}   