export type User = {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string | string[];
    [key: string]: any;
};

export type AuthenticatedRequest = Express.Request & {
    user?: User;
    login: (user: any, callback: (err: any) => void) => void;
    logout: (callback: (err: any) => void) => void;
    isAuthenticated: () => boolean;
};