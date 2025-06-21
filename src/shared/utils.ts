//utils.ts
import Container from 'typedi';
import { Request, Express, Response, NextFunction } from 'express';
import { ProxyIntegrationResult } from 'aws-lambda-router/lib/proxyIntegration';
import { APIGatewayEventRequestContext, APIGatewayProxyEvent } from 'aws-lambda';

// logging
import { LoggerService } from '../core/logging/logger.service';

// interface
import {
    ApiResponse,
    ErrorResponse,
    LambdaResponse,
} from '../core/common/interfaces/route.interface';
import { ConfigService } from '../config/configuration';

const configService = new ConfigService();
const logger = Container.get(LoggerService);
const IS_DEV = configService.isDevelopment();

/**
 * Normalizes a path by ensuring it starts with a forward slash
 * @param path The path to normalize
 * @returns The normalized path
 */
export const normalizePath = (path: string): string => (path.startsWith('/') ? path : `/${path}`);

/**
 * Creates an error response object
 * @param statusCode The HTTP status code
 * @param message The error message
 * @param reqOrEvent The request or event object
 * @param error Optional error object
 * @returns An error response object
 */
export const createErrorResponse = (
    statusCode: number,
    message: string,
    reqOrEvent: Request | any,
    error?: any
): ErrorResponse => {
    const isExpressRequest = 'url' in reqOrEvent && 'method' in reqOrEvent;
    const path = isExpressRequest ? reqOrEvent.url : reqOrEvent?.path || '';
    const method = isExpressRequest
        ? reqOrEvent.method
        : reqOrEvent?.httpMethod || reqOrEvent?.method || '';

    const errorData = {
        statusCode,
        timestamp: new Date().toISOString(),
        path,
        method,
    };

    const response: ErrorResponse = {
        success: false,
        data: errorData,
        error: message,
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
            } else if (error.details) {
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
            } catch {
                console.error('Failed to parse error body:', error.body);
            }
        }

        if (error && typeof error === 'object') {
            Object.entries(error).forEach(([key, value]) => {
                if (
                    ![
                        'message',
                        'statusCode',
                        'status',
                        'stack',
                        'response',
                        'name',
                        'timestamp',
                        'path',
                        'method',
                    ].includes(key)
                ) {
                    response[key as keyof ErrorResponse] = value;
                }
            });
        }
    }

    return response;
};

/**
 * Creates a success response object
 * @param result The result data to include in the response
 * @param existingHeaders Optional existing headers to include in the response
 * @returns A success response object
 */
export const createSuccessResponse = (
    result: any,
    existingHeaders: Record<string, any> = {}
): ApiResponse => ({
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

/**
 * Wraps a handler function with error handling and response formatting
 * @param handler The handler function to wrap
 * @returns A wrapped handler function that handles errors and formats responses
 */
export const wrapHandler = (handler: (...args: any[]) => Promise<any>) => {
    return async (event: any, context: any): Promise<LambdaResponse> => {
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
                        } catch {
                            error = { message: result.body };
                        }
                    } else {
                        error = result.body || {};
                    }

                    // Create a new error with the original error message or a default message
                    const err = new Error(error?.message || error?.error || 'An error occurred');

                    // Preserve all original error properties
                    Object.assign(err, error);

                    // Ensure status code is set
                    (err as any).statusCode = result.statusCode;

                    throw err;
                }

                // For successful responses, ensure proper headers and body format
                return {
                    statusCode: result.statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true,
                        ...(result.headers || {}),
                    },
                    body:
                        typeof result.body === 'string' ? result.body : JSON.stringify(result.body),
                };
            }

            // Convert ApiResponse to Lambda response
            const successResponse = createSuccessResponse(result);
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(successResponse),
            };
        } catch (error: any) {
            console.error('=== ROUTE ERROR ===', error);

            // Extract error details from the error object
            const statusCode = error?.statusCode || error?.status || 500;
            let message = error?.message || 'An unexpected error occurred';

            // If the error has a body with an error message, use that
            if (error?.body) {
                try {
                    const body =
                        typeof error.body === 'string' ? JSON.parse(error.body) : error.body;
                    if (body.error) {
                        message = body.error;
                    }
                } catch {
                    console.error('Failed to parse error body:', error.body);
                    message = error.body;
                }
            }

            const errorResponse = createErrorResponse(statusCode, message, event, error);

            const responseBody = {
                success: false,
                data: errorResponse.data,
                error: errorResponse.error,
                ...(errorResponse.details && { details: errorResponse.details }),
                ...(errorResponse.name && { name: errorResponse.name }),
            };

            return {
                statusCode,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true,
                },
                body: JSON.stringify(responseBody),
            };
        }
    };
};

/**
 * Creates a Lambda handler function from an Express router
 * @param expressRouter The Express router to convert
 * @returns A Lambda-compatible handler function
 */
export const createLambdaHandler = (expressRouter: any): any => {
    return (
        event: any,
        context: APIGatewayEventRequestContext
    ): Promise<ProxyIntegrationResult> => {
        return new Promise(resolve => {
            const pathParams = event.paths || {};
            const path = event.path;
            const routePath = event.routePath || '';

            // use logger
            if (process.env.NODE_ENV !== 'production') {
                logger.info('Incoming request:', {
                    path,
                    routePath,
                    pathParams,
                    httpMethod: event.httpMethod,
                });
            }

            // Convert Lambda event to Express-like request
            const req = {
                method: event.httpMethod,
                path: event.path,
                query: event.queryStringParameters || {},
                headers: event.headers || {},
                body: event.body
                    ? typeof event.body === 'string'
                        ? JSON.parse(event.body)
                        : event.body
                    : {},
                params: pathParams,
                url: path,
                originalUrl: path,
                // Add raw event and context for advanced use cases
                lambdaEvent: event,
                lambdaContext: context,
            } as any;

            // Create response object
            const res: any = {
                statusCode: 200,
                headers: {},
                body: '',
                setHeader(key: string, value: string) {
                    this.headers = this.headers || {};
                    this.headers[key] = value;
                    return this;
                },
                status(code: number) {
                    this.statusCode = code;
                    return this;
                },
                json(data: any) {
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
                                method: event.httpMethod,
                            },
                            error: data?.message || data?.error || 'An error occurred',
                            ...(data?.name && { name: data.name }),
                            ...(IS_DEV && data?.stack && { details: data.stack }),
                        };
                        responseData = errorData;
                    }

                    resolve({
                        statusCode: this.statusCode,
                        headers: this.headers,
                        body: JSON.stringify(responseData),
                        isBase64Encoded: false,
                    } as ProxyIntegrationResult);
                },
                send(data: string) {
                    this.body = data;
                    resolve({
                        statusCode: this.statusCode,
                        headers: this.headers,
                        body: this.body,
                        isBase64Encoded: false,
                    } as ProxyIntegrationResult);
                },
            };

            // Call the Express router
            expressRouter(req, res, (error: any) => {
                if (error) {
                    resolve({
                        statusCode: error.statusCode || 500,
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
                        isBase64Encoded: false,
                    } as ProxyIntegrationResult);
                } else if (!res.headersSent) {
                    res.status(404).json({ error: 'Not Found' });
                }
            });
        });
    };
};

/**
 * Converts an Express request to an API Gateway event format
 * @param req Express request object
 * @returns API Gateway compatible event object
 */
export const createLambdaEvent = (req: Request): APIGatewayProxyEvent => {
    return {
        httpMethod: req.method,
        path: req.path,
        headers: req.headers as { [name: string]: string },
        queryStringParameters: (req.query as { [name: string]: string }) || {},
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
    } as unknown as APIGatewayProxyEvent;
};

/**
 * Registers and logs routes for each router
 * @param app Express application instance
 * @param registeredRouters Array of registered router instances
 * @param apiPrefix API prefix path
 */
export const registerAndLogRoutes = (
    app: Express,
    registeredRouters: any[],
    apiPrefix: string
): void => {
    registeredRouters.forEach(router => {
        const routerName = router.controllerName || router.constructor.name;
        const logger = Container.get(LoggerService);

        // Register the router with Express
        app.use(apiPrefix, router.router);

        // Log the routes from the router's getRoutes() method if it exists
        if (typeof router.getRoutes === 'function') {
            const routes = router.getRoutes();
            routes.forEach((route: any) => {
                logger.info(`${routerName} [${route.method}] ${apiPrefix}${route.path}`);
            });
        }
        // Fallback to stack inspection if getRoutes() doesn't exist
        else if (router.router?.stack) {
            router.router.stack.forEach((layer: any) => {
                if (layer.route && layer.route.path) {
                    const method = Object.keys(layer.route.methods)[0].toUpperCase();
                    logger.info(`[${method}] ${apiPrefix}${layer.route.path}`);
                }
            });
        }
    });
};

/**
 * Sets up the global error handler middleware
 * @param app Express application instance
 */
export const setupGlobalErrorHandler = (app: Express): void => {
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
        const logger = Container.get(LoggerService);
        logger.error('Unhandled error', {
            error: err.message,
            stack: err.stack,
            url: req.originalUrl,
            method: req.method,
        });

        // check if headers sent
        if (res.headersSent) {
            return next(err);
        }

        // Check if we have a valid response object
        if (res && typeof res.status === 'function') {
            return res.status(err.statusCode || 500).json(
                createErrorResponse(500, err.message, req, {
                    error: err.message,
                    ...err,
                    stack: err.stack,
                    method: req.method,
                    details: IS_DEV ? err.stack : undefined,
                })
            );
        }

        logger.error('Invalid response object in error handler');
        next(err);
    });
};

/**
 * Sets up the 404 handler middleware
 * @param app Express application instance
 */
export const setupNotFoundHandler = (app: Express): void => {
    app.use((req: Request, res: Response) => {
        res.status(404).json(createErrorResponse(404, 'Not Found', req));
    });
};
