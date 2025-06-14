import { NextFunction, Request, Response } from "express";

/**
 * Rate limit guard
 * @param maxRequests Maximum number of requests allowed
 * @param windowMs Time window in milliseconds
 * @returns The rate limit middleware function
 */
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