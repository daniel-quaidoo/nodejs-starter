export type User = {
    id: string;
    email: string;
    password?: string;
    [key: string]: any;
};

export type AuthenticatedRequest = Express.Request & {
    user?: User;
    login: (user: any, callback: (err: any) => void) => void;
    logout: (callback: (err: any) => void) => void;
    isAuthenticated: () => boolean;
};