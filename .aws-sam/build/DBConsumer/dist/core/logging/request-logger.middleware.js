"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorLogger = exports.requestLogger = void 0;
const typedi_1 = require("typedi");
const uuid_1 = require("uuid");
// logger
const logger_service_1 = require("./logger.service");
/**
 * Express middleware that logs HTTP requests and responses
 * Automatically adds a request ID to each request for tracing
 */
const requestLogger = (req, res, next) => {
    const logger = typedi_1.Container.get(logger_service_1.LoggerService);
    const requestId = req.headers['x-request-id'] || (0, uuid_1.v4)();
    const start = Date.now();
    // Add request ID to the request object for use in controllers
    req.requestId = requestId;
    // Log the incoming request
    logger.info('Incoming request', {
        requestId,
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        userAgent: req.get('user-agent'),
        // Only log request body for non-GET requests
        ...(req.method !== 'GET' && req.body && Object.keys(req.body).length > 0
            ? { body: req.body }
            : {})
    });
    // Capture response finish event to log the response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            requestId,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseTime: duration
        };
        // Include response body for error statuses
        if (res.statusCode >= 400) {
            const responseBody = res._getData?.();
            if (responseBody) {
                try {
                    logData.response = JSON.parse(responseBody);
                }
                catch (e) {
                    logData.response = responseBody;
                }
            }
        }
        // Log at appropriate level based on status code
        if (res.statusCode >= 500) {
            logger.error('Request error', logData);
        }
        else if (res.statusCode >= 400) {
            logger.warn('Request warning', logData);
        }
        else {
            logger.info('Request completed', logData);
        }
    });
    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);
    next();
};
exports.requestLogger = requestLogger;
/**
 * Error handling middleware that logs errors
 */
const errorLogger = (err, req, res, next) => {
    const logger = typedi_1.Container.get(logger_service_1.LoggerService);
    const requestId = req.requestId || 'unknown';
    logger.error('Unhandled error', {
        requestId,
        error: {
            name: err.name,
            message: err.message,
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
        },
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    });
    next(err);
};
exports.errorLogger = errorLogger;
//# sourceMappingURL=request-logger.middleware.js.map