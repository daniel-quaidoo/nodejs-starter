"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const typedi_1 = require("typedi");
const uuid_1 = require("uuid");
// logger
const logger_1 = require("../../shared/logger");
const requestLogger = (req, res, next) => {
    const logger = typedi_1.Container.get(logger_1.Logger);
    const requestId = (0, uuid_1.v4)();
    const start = Date.now();
    // Log request
    logger.info('Incoming request', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        body: req.method !== 'GET' ? req.body : undefined,
    });
    // Capture response finish
    res.on('finish', () => {
        const duration = Date.now() - start;
        logger.info('Request completed', {
            requestId,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.middleware.js.map