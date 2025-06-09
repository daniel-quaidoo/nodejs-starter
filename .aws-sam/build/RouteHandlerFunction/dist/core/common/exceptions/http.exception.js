"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForbiddenException = exports.UnauthorizedException = exports.BadRequestException = exports.ConflictException = exports.NotFoundException = exports.HttpException = void 0;
class HttpException extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpException = HttpException;
class NotFoundException extends HttpException {
    constructor(message = 'Resource not found', details) {
        super(404, message, details);
    }
}
exports.NotFoundException = NotFoundException;
class ConflictException extends HttpException {
    constructor(message = 'Conflict occurred', details) {
        super(409, message, details);
    }
}
exports.ConflictException = ConflictException;
class BadRequestException extends HttpException {
    constructor(message = 'Bad request', details) {
        super(400, message, details);
    }
}
exports.BadRequestException = BadRequestException;
class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized', details) {
        super(401, message, details);
    }
}
exports.UnauthorizedException = UnauthorizedException;
class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden', details) {
        super(403, message, details);
    }
}
exports.ForbiddenException = ForbiddenException;
//# sourceMappingURL=http.exception.js.map