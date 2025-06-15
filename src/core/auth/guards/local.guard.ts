import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

// service
import { AuthService } from '../../../modules/auth/service/auth.service';

/**
 * Authentication middleware
 * @param options Options for the middleware
 * @returns The middleware function
 */
export const authMiddleware = (options: { roles?: string[] } = {}): any => {
    // TODO: fix type
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;

            if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.toString().split(' ')[1];
            const authService = Container.get(AuthService);
            const decoded = authService.verifyToken(token);

            if (!decoded) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Attach user to request
            req.user = decoded;

            // Check roles if specified
            if (options.roles?.length) {
                const userRoles = Array.isArray(decoded.role) ? decoded.role : [decoded.role];
                const hasRequiredRole = options.roles.some(role => userRoles.includes(role));

                if (!hasRequiredRole) {
                    return res.status(403).json({
                        success: false,
                        message: 'Insufficient permissions',
                    });
                }
            }

            next();
        } catch {
            return res.status(500).json({ message: 'Authentication failed' });
        }
    };
};
