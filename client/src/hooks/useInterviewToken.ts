import axios from "axios";
import { useCallback, useState } from "react";

interface TokenResponseData {
    token: string,
    roomName: string,
    serverUrl: string
}

interface useInterviewTokenResult {
     connectionDetails: TokenResponseData | null;
     isLoading: boolean;
     error: string | null;
     fetchToken: (interviewId: string) => Promise<void>;
}

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
console.log("Backend URL : ", BACKEND_URL)

export function useInterviewToken(): useInterviewTokenResult {
    const [connectionDetails, setConnectionDetails] = useState<TokenResponseData | null>(null);
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
    
            const json = res.data; 
            
            console.log("Token response:", json);

            setConnectionDetails(res.data as TokenResponseData);    
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Failed to fetch interview token";
            setError(message);
            console.error("Token fetch failed:", error);
        } finally {
            setIsLoading(false);
        }
    }, [])

    return { connectionDetails, isLoading, error, fetchToken}
}