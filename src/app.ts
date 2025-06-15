import Container from 'typedi';
import { LoggerService } from './core/logging/logger.service';
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';

// local import
import { ConfigService } from './config/configuration';
import { handler as routerHandler, bootstrap } from './bootstrap';

const configService = new ConfigService();
const logger = Container.get(LoggerService);

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
        return await routerHandler(event, context);
    } catch (error) {
        logger.error('Error processing request:', error as Record<string, any>);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'error',
                message: 'Internal server error',
                error: error instanceof Error ? error.message : 'Unknown error',
                timestamp: new Date().toISOString(),
            }),
        };
    }
};

/**
 * Local development server
 * @returns Promise<void> - Returns void
 */
if (configService.isDevelopment() && require.main === module) {
    bootstrap()
        .then(({ app }) => {
            const port = process.env.PORT || 3000;
            app.listen(port, () => {
                logger.info(`Server is running on http://localhost:${port}`);
                logger.info(`Health check: http://localhost:${port}/api/health`);
            });
        })
        .catch(error => {
            logger.error('Failed to start application:', error as Record<string, any>);
            process.exit(1);
        });
}
