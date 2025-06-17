export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: Record<string, any>;
    };
    meta?: {
        page?: number;
        limit?: number;
        total?: number;
        [key: string]: any;
    };
}
