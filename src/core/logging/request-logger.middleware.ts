import { Container } from 'typedi';
import { v4 as uuidv4 } from 'uuid';
import { Response, NextFunction } from 'express';

import { Request } from 'src/types/express'

// logger
import { LoggerService } from './logger.service';

/**
 * Express middleware that logs HTTP requests and responses
 * Automatically adds a request ID to each request for tracing
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const response = res as unknown as Response & { on: (event: string, listener: (...args: any[]) => void) => void };
    const logger = Container.get(LoggerService);
    const requestId = req.headers['x-request-id'] || uuidv4();
    const start = Date.now();

    // Add request ID to the request object for use in controllers
    req.requestId = requestId as string;

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
    response.on('finish', () => {
        const duration = Date.now() - start;
        const logData: Record<string, any> = {
            requestId,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            responseTime: duration
        };

        // Include response body for error statuses
        if (res.statusCode >= 400) {
            const responseBody = (res as any)._getData?.();
            if (responseBody) {
                try {
                    logData.response = JSON.parse(responseBody);
                } catch (e) {
                    logData.response = responseBody;
                }
            }
        }

        // Log at appropriate level based on status code
        if (res.statusCode >= 500) {
            logger.error('Request error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Request warning', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    next();
};

/**
 * Error handling middleware that logs errors
 */
export const errorLogger = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const logger = Container.get(LoggerService);
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
