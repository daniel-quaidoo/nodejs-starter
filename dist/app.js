"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// local import
const configuration_1 = require("./config/configuration");
const bootstrap_1 = require("./bootstrap");
const configService = new configuration_1.ConfigService();
/**
 * AWS Lambda handler function
 * @param event API Gateway event object
 * @param context AWS Lambda context object
 * @returns Promise<APIGatewayProxyResult> - Returns the API Gateway proxy result
 */
const handler = async (event, context) => {
    try {
        return (0, bootstrap_1.handler)(event, context);
    }
    catch (error) {
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
exports.handler = handler;
/**
 * Local development server
 * @returns Promise<void> - Returns void
 */
if (configService.isDevelopment() && require.main === module) {
    (0, bootstrap_1.bootstrap)().then(({ app }) => {
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
//# sourceMappingURL=app.js.map