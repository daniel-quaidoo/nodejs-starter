import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// local import
import { ConfigService } from './config/configuration';
import { handler as routerHandler, bootstrap } from './bootstrap';

const configService = new ConfigService();

/**
 * AWS Lambda handler function
 * @param event API Gateway event object
 * @param context AWS Lambda context object
 * @returns Promise<APIGatewayProxyResult> - Returns the API Gateway proxy result
 */
export const handler = async (
    event: APIGatewayProxyEvent,
    context: Context
): Promise<APIGatewayProxyResult> => {
    try {
        return routerHandler(event, context);
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'error',
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString()
            }),
        };
    }
};

/**
 * Local development server
 * @returns Promise<void> - Returns void
 */
if (configService.isDevelopment() && require.main === module) {
    bootstrap().then(({ app }) => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
            console.log(`Health check: http://localhost:${port}/api/health`);
        });
    }).catch(error => {
        console.error('Failed to start application:', error);
        process.exit(1);
    });
}
