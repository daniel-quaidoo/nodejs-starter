import { Request, Response, NextFunction } from 'express';

/**
 * Returns CORS middleware with proper headers and preflight handling
 * @param origin Array of allowed origins (default: ['*'])
 */
export const corsMiddleware = (
    origin: string[] = ['*']
): ((req: Request, res: Response, next: NextFunction) => void) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('Access-Control-Allow-Origin', origin.join(', '));
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }

        next();
    };
};

export const setupCorsMiddleware = corsMiddleware;
