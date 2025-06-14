import passport from 'passport';
import { Request, Response, NextFunction } from 'express';


export function JwtPassportGuard(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: 'Authentication error',
                error: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }

        if (!user) {
            let message = 'Unauthorized';
            if (info && info.message === 'No auth token') {
                message = 'No authentication token provided';
            } else if (info && info.message === 'jwt expired') {
                message = 'Authentication token has expired';
            } else if (info && info.message) {
                message = info.message;
            }

            return res.status(401).json({
                success: false,
                message,
                code: 'UNAUTHORIZED'
            });
        }

        req.user = user;
        return next();
    })(req, res, next);
}