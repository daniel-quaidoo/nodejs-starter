"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNotFoundHandler = exports.setupGlobalErrorHandler = exports.registerAndLogRoutes = exports.createLambdaEvent = exports.createLambdaHandler = exports.wrapHandler = exports.createSuccessResponse = exports.createErrorResponse = exports.normalizePath = exports.setupCorsMiddleware = void 0;
//utils.ts
const typedi_1 = __importDefault(require("typedi"));
// logging
const logger_service_1 = require("../core/logging/logger.service");
const IS_DEV = process.env.NODE_ENV === 'development';
/**
 * Returns CORS middleware with proper headers and preflight handling
 * @param origin Array of allowed origins (default: ['*'])
 */
const setupCorsMiddleware = (origin = ['*']) => {
    return (req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', origin.join(', '));
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }
        next();
    };
};
exports.setupCorsMiddleware = setupCorsMiddleware;
/**
 * Normalizes a path by ensuring it starts with a forward slash
 * @param path The path to normalize
 * @returns The normalized path
 */
const normalizePath = (path) => path.startsWith('/') ? path : `/${path}`;
exports.normalizePath = normalizePath;
/**
 * Creates an error response object
 * @param statusCode The HTTP status code
 * @param message The error message
 * @param reqOrEvent The request or event object
 * @param error Optional error object
 * @returns An error response object
 */
const createErrorResponse = (statusCode, message, reqOrEvent, error) => {
    const isExpressRequest = 'url' in reqOrEvent && 'method' in reqOrEvent;
    const path = isExpressRequest
        ? reqOrEvent.url
        : (reqOrEvent?.path || '');
    const method = isExpressRequest
        ? reqOrEvent.method
        : (reqOrEvent?.httpMethod || reqOrEvent?.method || '');
    const errorData = {
        statusCode,
        timestamp: new Date().toISOString(),
        path,
        method,
    };
    const response = {
        success: false,
        data: errorData,
        error: message
    };
    if (error) {
        // Preserve the error name if it exists
        if (error.name) {
            response.name = error.name;
        }
        // In development, include the full stack trace
        if (IS_DEV) {
            // If we have a stack trace, use it
            if (error.stack) {
                response.details = error.stack;
            }
            else if (error.details) {
                response.details = error.details;
            }
        }
        // In production, just include the error message if it's different from the main message
        else if (error.message && error.message !== message) {
            response.details = error.message;
        }
        // If we have a body with error details, include them
        if (error.body) {
            try {
                const body = typeof error.body === 'string' ? JSON.parse(error.body) : error.body;
                if (body.error && !response.details) {
                    response.details = body.error;
                }
                if (body.details && IS_DEV) {
                    response.details = body.details;
                }
            }
            catch (e) {
                console.error('Failed to parse error body:', error.body);
            }
        }
        if (error && typeof error === 'object') {
            Object.entries(error).forEach(([key, value]) => {
                if (!['message', 'statusCode', 'status', 'stack', 'response', 'name', 'timestamp', 'path', 'method'].includes(key)) {
                    response[key] = value;
                }
            });
        }
    }
    return response;
};
exports.createErrorResponse = createErrorResponse;
/**
 * Creates a success response object
 * @param result The result data to include in the response
 * @param existingHeaders Optional existing headers to include in the response
 * @returns A success response object
 */
const createSuccessResponse = (result, existingHeaders = {}) => ({
    success: true,
    data: result,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        ...existingHeaders,
    },
    body: JSON.stringify({
        success: true,
        data: result,
    }),
});
exports.createSuccessResponse = createSuccessResponse;
/**
 * Wraps a handler function with error handling and response formatting
 * @param handler The handler function to wrap
 * @returns A wrapped handler function that handles errors and formats responses
 */
const wrapHandler = (handler) => {
    return async (event, context) => {
        try {
            const result = await handler(event, context);
            // If the handler already returned a Lambda response
            if (result && typeof result === 'object' && 'statusCode' in result) {
                if (result.statusCode >= 400) {
                    let error;
                    // If the body is a string, try to parse it as JSON
                    if (typeof result.body === 'string') {
                        try {
                            error = JSON.parse(result.body);
                        }
                        catch (e) {
                            error = { message: result.body };
                        }
                    }
                    else {
                        error = result.body || {};
                    }
                    // Create a new error with the original error message or a default message
                    const err = new Error(error?.message || error?.error || 'An error occurred');
                    // Preserve all original error properties
                    Object.assign(err, error);
                    // Ensure status code is set
                    err.statusCode = result.statusCode;
                    throw err;
                }
                // For successful responses, ensure proper headers and body format
                return {
                    statusCode: result.statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        ...(result.headers || {})
                    },
                    body: typeof result.body === 'string' ? result.body : JSON.stringify(result.body)
                };
            }
            // Convert ApiResponse to Lambda response
            const successResponse = (0, exports.createSuccessResponse)(result);
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(successResponse)
            };
        }
        catch (error) {
            console.error('=== ROUTE ERROR ===', error);
            // Extract error details from the error object
            const statusCode = error?.statusCode || error?.status || 500;
            let message = error?.message || 'An unexpected error occurred';
            // If the error has a body with an error message, use that
            if (error?.body) {
                try {
                    const body = typeof error.body === 'string' ? JSON.parse(error.body) : error.body;
                    if (body.error) {
                        message = body.error;
                    }
                }
                catch (e) {
                    // If we can't parse the body, use it as is
                    message = error.body;
                }
            }
            const errorResponse = (0, exports.createErrorResponse)(statusCode, message, event, error);
            const responseBody = {
                success: false,
                data: errorResponse.data,
                error: errorResponse.error,
                ...(errorResponse.details && { details: errorResponse.details }),
                ...(errorResponse.name && { name: errorResponse.name })
            };
            return {
                statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(responseBody)
            };
        }
    };
};
exports.wrapHandler = wrapHandler;
/**
 * Creates a Lambda handler function from an Express router
 * @param expressRouter The Express router to convert
 * @returns A Lambda-compatible handler function
 */
const createLambdaHandler = (expressRouter) => {
    return async (event, context) => {
        // Create a mock Express request object for consistent error handling
        const mockReq = {
            url: event.path,
            originalUrl: event.path,
            method: event.httpMethod
        };
        return new Promise((resolve) => {
            // Convert Lambda event to Express-like request
            const req = {
                method: event.httpMethod,
                path: event.path,
                query: event.queryStringParameters || {},
                headers: event.headers || {},
                body: event.body ? (typeof event.body === 'string' ? JSON.parse(event.body) : event.body) : {},
                params: event.pathParameters || {}
            };
            // Create response object
            const res = {
                statusCode: 200,
                headers: {},
                body: '',
                setHeader: function (key, value) {
                    this.headers = this.headers || {};
                    this.headers[key] = value;
                    return this;
                },
                status: function (code) {
                    this.statusCode = code;
                    return this;
                },
                json: function (data) {
                    this.body = JSON.stringify(data);
                    this.setHeader('Content-Type', 'application/json');
                    let responseData = data;
                    if (this.statusCode >= 400) {
                        const errorData = {
                            success: false,
                            data: {
                                statusCode: this.statusCode,
                                timestamp: new Date().toISOString(),
                                path: event.path,
                                method: event.httpMethod
                            },
                            error: data?.message || data?.error || 'An error occurred',
                            ...(data?.name && { name: data.name }),
                            ...(process.env.NODE_ENV === 'development' && data?.stack && { details: data.stack })
                        };
                        responseData = errorData;
                    }
                    resolve({
                        statusCode: this.statusCode,
                        headers: this.headers,
                        body: JSON.stringify(responseData),
                        isBase64Encoded: false
                    });
                },
                send: function (data) {
                    this.body = data;
                    resolve({
                        statusCode: this.statusCode,
                        headers: this.headers,
                        body: this.body,
                        isBase64Encoded: false
                    });
                }
            };
            // Call the Express router
            expressRouter(req, res, (error) => {
                if (error) {
                    resolve({
                        statusCode: error.statusCode || 500,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
                        isBase64Encoded: false
                    });
                }
                else if (!res.headersSent) {
                    res.status(404).json({ error: 'Not Found' });
                }
            });
        });
    };
};
exports.createLambdaHandler = createLambdaHandler;
/**
 * Converts an Express request to an API Gateway event format
 * @param req Express request object
 * @returns API Gateway compatible event object
 */
const createLambdaEvent = (req) => {
    return {
        httpMethod: req.method,
        path: req.path,
        headers: req.headers,
        queryStringParameters: req.query || {},
        pathParameters: req.params || {},
        body: req.body ? JSON.stringify(req.body) : null,
        isBase64Encoded: false,
        requestContext: {
            accountId: 'local',
            apiId: 'local',
            httpMethod: req.method,
            identity: {
                accessKey: null,
                accountId: null,
                apiKey: null,
                apiKeyId: null,
                caller: null,
                clientCert: null,
                cognitoAuthenticationProvider: null,
                cognitoAuthenticationType: null,
                cognitoIdentityId: null,
                cognitoIdentityPoolId: null,
                principalOrgId: null,
                sourceIp: req.ip,
                user: null,
                userAgent: req.get('user-agent') || '',
                userArn: null,
            },
            path: req.path,
            protocol: req.protocol,
            requestId: 'local',
            requestTimeEpoch: Date.now(),
            resourceId: 'local',
            resourcePath: req.path,
            stage: 'local',
        },
        resource: req.path,
        stageVariables: {},
    };
};
exports.createLambdaEvent = createLambdaEvent;
/**
 * Registers and logs routes for each router
 * @param app Express application instance
 * @param registeredRouters Array of registered router instances
 * @param apiPrefix API prefix path
 */
const registerAndLogRoutes = (app, registeredRouters, apiPrefix) => {
    registeredRouters.forEach(router => {
        const routerName = router.controllerName || router.constructor.name;
        console.log(`\n${routerName} Routes:`);
        // Register the router with Express
        app.use(apiPrefix, router.router);
        // Log the routes from the router's getRoutes() method if it exists
        if (typeof router.getRoutes === 'function') {
            const routes = router.getRoutes();
            routes.forEach((route) => {
                console.log(`[${route.method}] ${apiPrefix}${route.path}`);
            });
        }
        // Fallback to stack inspection if getRoutes() doesn't exist
        else if (router.router?.stack) {
            router.router.stack.forEach((layer) => {
                if (layer.route && layer.route.path) {
                    const method = Object.keys(layer.route.methods)[0].toUpperCase();
                    console.log(`[${method}] ${apiPrefix}${layer.route.path}`);
                }
            });
        }
    });
};
exports.registerAndLogRoutes = registerAndLogRoutes;
/**
 * Sets up the global error handler middleware
 * @param app Express application instance
 */
const setupGlobalErrorHandler = (app) => {
    app.use((err, req, res, next) => {
        const logger = typedi_1.default.get(logger_service_1.LoggerService);
        logger.error('Unhandled error', {
            error: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method
        });
        res.status(err.statusCode || 500).json((0, exports.createErrorResponse)(500, err.message, req, {
            ...err,
            error: err.message,
            stack: err.stack,
            method: req.method,
            details: err.stack
        }));
    });
};
exports.setupGlobalErrorHandler = setupGlobalErrorHandler;
/**
 * Sets up the 404 handler middleware
 * @param app Express application instance
 */
const setupNotFoundHandler = (app) => {
    app.use((req, res) => {
        res.status(404).json((0, exports.createErrorResponse)(404, 'Not Found', req));
    });
};
exports.setupNotFoundHandler = setupNotFoundHandler;
//# sourceMappingURL=utils.js.map