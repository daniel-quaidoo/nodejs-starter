"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
// local imports
const app_1 = require("./app");
const utils_1 = require("./shared/utils");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express_1.default.json());
// Handle all routes
app.all('*', async (req, res) => {
    try {
        const context = {};
        const event = (0, utils_1.createLambdaEvent)(req);
        const result = await (0, app_1.handler)(event, context);
        // Set headers
        if (result.headers) {
            Object.entries(result.headers).forEach(([key, value]) => {
                if (value) {
                    res.setHeader(key, String(value));
                }
            });
        }
        // Send response
        res.status(result.statusCode || 200);
        // Handle different content types
        const contentType = res.getHeader('content-type');
        if (contentType && typeof contentType === 'string' && contentType.includes('application/json')) {
            res.json(JSON.parse(result.body || '{}'));
        }
        else {
            res.send(result.body);
        }
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
// Start the server
const server = (0, http_1.createServer)(app);
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Health check: http://localhost:${port}/health`);
});
// Handle shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
exports.default = server;
//# sourceMappingURL=local.js.map