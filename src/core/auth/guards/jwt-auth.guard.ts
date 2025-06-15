import Container from 'typedi';
import { Response, NextFunction } from 'express';

// service
import { AuthService } from '../../../modules/auth/service/auth.service';

/**
 * JWT authentication guard
 * @param req Request object
 * @param res Response object
 * @param next Next function for error handling
 */
export const JwtAuthGuard = async (req: any, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            await res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const authService = Container.get(AuthService);
        const decoded = authService.verifyToken(token);

        if (!decoded) {
            await res.status(401).json({ message: 'Invalid or expired token' });
        }

        // add user to request
        req.user = decoded;
        next();
    } catch (error) {
        await res.status(500).json({ message: 'Authentication failed' });
    }
};
