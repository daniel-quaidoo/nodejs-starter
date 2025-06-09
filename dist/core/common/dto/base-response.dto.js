"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseResponseDto = exports.PaginationMetaDto = void 0;
class PaginationMetaDto {
    constructor(page, limit, total) {
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = Math.ceil(total / limit);
    }
}
exports.PaginationMetaDto = PaginationMetaDto;
class BaseResponseDto {
    constructor(data, success = true, pagination, message) {
        this.success = success;
        this.data = data;
        this.message = message;
        if (pagination) {
            this.pagination = new PaginationMetaDto(pagination.page, pagination.limit, pagination.total);
        }
    }
    static success(data, pagination, message) {
        return new BaseResponseDto(data, true, pagination, message);
    }
    static error(message, data, pagination) {
        return new BaseResponseDto(data, false, pagination, message);
    }
}
exports.BaseResponseDto = BaseResponseDto;
//# sourceMappingURL=base-response.dto.js.map