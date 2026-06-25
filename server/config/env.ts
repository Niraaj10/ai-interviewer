import dotenv from "dotenv";
import path from "path";


dotenv.config({
    path: path.resolve(process.cwd(), ".env")
});


const REQUIRED_ENV_VARS = [
    "DATABASE_URL",
    "DIRECT_URL",
    "LIVEKIT_API_KEY",
    "LIVEKIT_API_SECRET",
    "LIVEKIT_URL",
    "GOOGLE_API_KEY",
] as const;

function assertReqEnvVars() {
    const missing  = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

    if (missing.length > 0) {
        throw new Error(
            `Missing required enviroment variables : ${missing.join(",")}. ` + 
            `Check your .env file`
        );
    }
}

assertReqEnvVars();