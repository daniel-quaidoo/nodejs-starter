import { NextFunction, Request, Response } from "express";

export const rateLimitGuard = (maxRequests: number, windowMs: number) => {
    const requests = new Map();
    
    return (req: Request, res: Response, next: NextFunction) => {
        const clientId = req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;
        
        // Clean old requests
        const clientRequests = requests.get(clientId) || [];
        const recentRequests = clientRequests.filter((time: number) => time > windowStart);
        
        if (recentRequests.length >= maxRequests) {
            return res.status(429).json({ error: 'Rate limit exceeded' });
        }
        
        recentRequests.push(now);
        requests.set(clientId, recentRequests);
        next();
    };
};