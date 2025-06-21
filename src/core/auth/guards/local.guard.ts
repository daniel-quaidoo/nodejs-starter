import { Container } from 'typedi';
import { Request, Response, NextFunction } from 'express';

// service
import { AuthService } from '../../../modules/auth/auth.service';

/**
 * Authentication middleware
 * @param options Options for the middleware
 * @returns The middleware function
 */
export const authMiddleware = (options: { roles?: string[] } = {}): any => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization || req.headers.Authorization;

            if (!authHeader || !authHeader.toString().startsWith('Bearer ')) {
                return res.status(401).json({ message: 'No token provided' });
            }

            const token = authHeader.toString().split(' ')[1];
            const authService = Container.get(AuthService);
            const user = await authService.verifyToken(token);

            if (!user) {
                return res.status(401).json({ message: 'Invalid or expired token' });
            }

            // Attach user to request
            req.user = user;

            // Check roles if specified
            if (options.roles?.length) {
                const extractRoleName = (
                    role: string | { name: string } | undefined
                ): string | null => {
                    if (!role) return null;
                    const name = typeof role === 'string' ? role : role.name;
                    return name.toLowerCase();
                };

                const userRoleNames = Array.isArray(user.roles)
                    ? user.roles.map(extractRoleName).filter((r): r is string => r !== null)
                    : [extractRoleName(user.roles)].filter((r): r is string => r !== null);

                const requiredRoles = options.roles.map(role => role.toLowerCase());
                const hasRequiredRole = userRoleNames.some(roleName =>
                    requiredRoles.includes(roleName)
                );

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
