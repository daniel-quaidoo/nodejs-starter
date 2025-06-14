import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
// import { SessionService } from '../../modules/session/session.service';

export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            // const sessionService = Container.get(SessionService);
            // const session = await sessionService.validateSession(token);
            // if (session) {
            //     req.user = session.user;
            // }
        }
        next();
    } catch (error) {
        next(error);
    }
};