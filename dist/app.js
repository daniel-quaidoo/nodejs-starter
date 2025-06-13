"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
// local imports
const bootstrap_1 = require("./bootstrap");
// For AWS Lambda
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
// For local development
if (process.env.NODE_ENV !== 'production' && require.main === module) {
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