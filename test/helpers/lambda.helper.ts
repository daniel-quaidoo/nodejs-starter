import { handler } from '../../src/app';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

interface LambdaTestOptions {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';
    path: string;
    body?: any;
    headers?: Record<string, string>;
    pathParameters?: Record<string, string>;
    queryStringParameters?: Record<string, string>;
    authToken?: string;
}

export const createLambdaEvent = (options: LambdaTestOptions): APIGatewayProxyEvent => {
    const {
        method,
        path,
        body,
        headers = {},
        pathParameters = {},
        queryStringParameters = {},
        authToken,
    } = options;

    // Set default headers
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    // Add auth token if provided
    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // Create the event object with required fields
    const event: APIGatewayProxyEvent = {
        httpMethod: method,
        path,
        body: null, // Initialize as null, will be set if body is provided
        headers: { ...defaultHeaders, ...headers },
        multiValueHeaders: {},
        isBase64Encoded: false,
        pathParameters: pathParameters || null,
        queryStringParameters: queryStringParameters || null,
        multiValueQueryStringParameters: null,
        stageVariables: null,
        requestContext: {
            accountId: '123456789012',
            apiId: 'test-api-id',
            authorizer: {},
            protocol: 'HTTP/1.1',
            httpMethod: method,
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
                sourceIp: '127.0.0.1',
                user: null,
                userAgent: 'Jest Test',
                userArn: null,
            },
            path,
            stage: 'test',
            requestId: 'test-request-id',
            requestTimeEpoch: Date.now(),
            resourceId: 'test-resource-id',
            resourcePath: path,
            requestTime: new Date().toISOString(),
            domainName: 'localhost',
            domainPrefix: ''
        },
        resource: path,
    };

    // Add body if provided
    if (body) {
        event.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    return event;
};

export const invokeLambda = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Create a mock context
    const context = {
        callbackWaitsForEmptyEventLoop: false,
        functionName: 'test-function',
        functionVersion: '$LATEST',
        invokedFunctionArn: 'arn:aws:lambda:us-east-1:123456789012:function:test-function',
        memoryLimitInMB: '256',
        awsRequestId: 'test-request-id',
        logGroupName: '/aws/lambda/test-function',
        logStreamName: '2023/01/01/[$LATEST]abcdef1234567890abcdef1234567890',
        getRemainingTimeInMillis: () => 30000,
        // @ts-ignore - These are deprecated but still needed for the test
        done: (error?: Error, result?: any) => { },
        // @ts-ignore
        fail: (error: Error | string) => { },
        // @ts-ignore
        succeed: (messageOrObject: any, object?: any) => { },
    };

    try {
        // Call the handler with just the event and context
        // The handler returns a Promise<APIGatewayProxyResult>
        return await handler(event, context);
    } catch (error) {
        // If the handler throws an error, wrap it in an API Gateway response
        return {
            statusCode: 500,
            body: JSON.stringify({
                status: 'error',
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        };
    }
};

export const parseLambdaResponse = <T = any>(response: APIGatewayProxyResult): T => {
    if (!response.body) {
        return {} as T;
    }
    return typeof response.body === 'string' ? JSON.parse(response.body) : response.body;
};
