import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// local imports
import { handler as routerHandler, bootstrap } from './bootstrap';

// For AWS Lambda
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

// For local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
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
