export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: Record<string, any>;
}
