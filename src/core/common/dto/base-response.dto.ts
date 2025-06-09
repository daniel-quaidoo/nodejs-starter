export class PaginationMetaDto {
    readonly page: number;

    readonly limit: number;

    readonly total: number;

    readonly totalPages: number;

    constructor(page: number, limit: number, total: number) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}

export class BaseResponseDto<T> {
    success: boolean;

    data: T;

    pagination?: PaginationMetaDto;

    message?: string;

    private constructor(
        data: T,
        success: boolean = true,
        pagination?: { page: number; limit: number; total: number },
        message?: string,
    ) {
        this.success = success;
        this.data = data;
        this.message = message;

        if (pagination) {
            this.pagination = new PaginationMetaDto(
                pagination.page,
                pagination.limit,
                pagination.total,
            );
        }
    }

    static success<T>(
        data: T,
        pagination?: { page: number; limit: number; total: number },
        message?: string,
    ): BaseResponseDto<T> {
        return new BaseResponseDto(data, true, pagination, message);
    }

    static error<T = any>(
        message: string,
        data?: T,
        pagination?: { page: number; limit: number; total: number }
    ): BaseResponseDto<T | undefined> {
        return new BaseResponseDto(data, false, pagination, message);
    }
}
