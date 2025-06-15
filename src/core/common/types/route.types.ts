import { APIGatewayProxyResult } from 'aws-lambda';
import { ProxyIntegrationResult } from 'aws-lambda-router/lib/proxyIntegration';

export type LambdaHandler = (
    event: any,
    context: any,
    next: any
) => Promise<ProxyIntegrationResult | APIGatewayProxyResult | string | void>;

export type AwsLambdaRouterRoute = {
    path: string;
    method: string;
    action: LambdaHandler;
};
