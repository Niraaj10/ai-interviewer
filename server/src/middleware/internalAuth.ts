import { NextFunction, Request, Response } from "express";

export function interalServiceAuth(
    req: Request,
    res: Response,
    next: NextFunction
) : void {
    const providedSecret = req.header("x-internal-service-secret");
    const expectedSecret = process.env.INTERNAL_SERVICE_SECRET;

    if (!expectedSecret) {
        console.error("INTERNAL_SERVICE_SECRET is not set on the server.");
        res.status(500).json({ 
            message: "Server misconfiguration." 
        });
        return;
    }

    if (!providedSecret || providedSecret !== expectedSecret) {
        res.status(401).json({ 
            message: "Unauthorized." 
        });
        return;
    }

    next();
}