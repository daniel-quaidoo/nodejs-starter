import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            requestId: string;
            user?: User;
            isAuthenticated(): boolean;
            login(user: User, callback: (err: any) => void): void;
            logout(callback: (err: any) => void): void;
        }
    }
}

export { Request };