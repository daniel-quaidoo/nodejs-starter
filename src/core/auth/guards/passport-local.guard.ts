import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

/**
 * Local authentication guard using Passport
 * Provides better error responses for local authentication
 */
export const LocalPassportGuard = (req: Request, res: Response, next: NextFunction): void => {
    passport.authenticate('local', { session: false }, (err: any, user: any, info: any): any => {
        if (err) {
            return next(err);
        }

        // handle missing user (authentication failed)
        if (!user) {
            let message = 'Authentication failed';
            let code = 'AUTH_ERROR';
            let statusCode = 401;

            // handle different types of authentication failures
            if (info?.message) {
                message = info.message;

                // map specific error messages to error codes
                if (
                    message.toLowerCase().includes('password') ||
                    message.toLowerCase().includes('email') ||
                    message.toLowerCase().includes('credentials')
                ) {
                    code = 'INVALID_CREDENTIALS';
                } else if (message.toLowerCase().includes('missing')) {
                    code = 'MISSING_CREDENTIALS';
                    statusCode = 400;
                } else if (message.toLowerCase().includes('account')) {
                    code = 'ACCOUNT_ISSUE';
                }
            }

            return res.status(statusCode).json({
                success: false,
                message,
                code,
                ...(process.env.NODE_ENV === 'development' && info ? { details: info } : {}),
            });
        }

        req.user = user;
        next();
    })(req, res, next);
};

export class LocalAuthGuard {
    public canActivate(
        context: any
    ): boolean | Promise<boolean> | import('rxjs').Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return new Promise(resolve => {
            LocalPassportGuard(request, response, (err: any) => {
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            });
        });
    }
}
