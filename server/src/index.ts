import { app } from './app'; 
import dotenv from 'dotenv';

// Load environment variables before doing anything else
dotenv.config({
    path: './.env'
});

const PORT: string | number = process.env.PORT || 7000;

// Self-invoking async function (IIFE) for server initialization
(async (): Promise<void> => {
    try {
        // If you uncomment these later, ensure they are typed/imported correctly
        // await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // await connectDB();
        
        
        // app.on("error", (error: Error): void => {
        //     console.error("Express app error: ", error);
        //     throw error;
        // });

        app.listen(PORT, (): void => {
            console.log(`Server is running and listening on port ${PORT}`);
        });

    } catch (error) {
        console.error("Database or Server startup initialization failed: ", error);
        process.exit(1); // Standard practice: exit the process if startup fails
    }
})();