import Container from 'typedi';
import { Response, NextFunction } from 'express';

// service
import { AuthService } from '../../../modules/auth/service/auth.service';


export const JwtAuthGuard = async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const authService = Container.get(AuthService);
        const decoded = authService.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // add user to request
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authentication failed' });
    }
};