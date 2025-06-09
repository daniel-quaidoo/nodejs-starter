export class HttpException extends Error {
    constructor(
        public readonly statusCode: number,
        public readonly message: string,
        public readonly details?: any
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundException extends HttpException {
    constructor(message = 'Resource not found', details?: any) {
        super(404, message, details);
    }
}

export class ConflictException extends HttpException {
    constructor(message = 'Conflict occurred', details?: any) {
        super(409, message, details);
    }
}

export class BadRequestException extends HttpException {
    constructor(message = 'Bad request', details?: any) {
        super(400, message, details);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized', details?: any) {
        super(401, message, details);
    }
}

export class ForbiddenException extends HttpException {
    constructor(message = 'Forbidden', details?: any) {
        super(403, message, details);
    }
}
