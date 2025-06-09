"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLambdaEvent = exports.createLambdaHandler = exports.wrapHandler = exports.createSuccessResponse = exports.createErrorResponse = exports.normalizePath = void 0;
const IS_DEV = process.env.NODE_ENV === 'development';
const normalizePath = (path) => path.startsWith('/') ? path : `/${path}`;
exports.normalizePath = normalizePath;
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
// Convert Express request to Lambda event
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
//# sourceMappingURL=utils.js.map