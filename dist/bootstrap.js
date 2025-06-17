"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.bootstrap = void 0;
require("reflect-metadata");
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const express_session_1 = __importDefault(require("express-session"));
const express_1 = __importDefault(require("express"));
// logger
const logging_1 = require("./core/logging");
// config
const configuration_1 = require("./config/configuration");
// module
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const health_module_1 = require("./modules/health/health.module");
// loader
const module_loader_1 = require("./core/common/di/module.loader");
// factory
const database_factory_1 = require("./core/db/factory/database.factory");
// router registry
const router_registry_1 = require("./core/common/router/router.registry");
// interfaces
const database_interface_1 = require("./core/db/interfaces/database.interface");
// middleware
const cors_middleware_1 = require("./core/middleware/cors.middleware");
const request_logger_middleware_1 = require("./core/logging/request-logger.middleware");
const passport_1 = require("./core/auth/passport");
// utils
const utils_1 = require("./shared/utils");
let isWarm = false;
let dataSource;
const logger = typedi_1.Container.get(logging_1.LoggerService);
/**
 * Initializes the application services, database connections, etc.
 * @returns Promise<{ app: Express; dataSource: DataSource }> - Returns the Express app and DataSource
 */
const bootstrap = async () => {
    // Initialize configuration
    const configService = new configuration_1.ConfigService();
    typedi_1.Container.set(configuration_1.ConfigService, configService);
    // Register API routes
    const apiPrefix = configService.get('API_PREFIX') || '/api';
    // Initialize Express app
    const app = (0, express_1.default)();
    // Apply middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Enable CORS for all routes
    app.use((0, cors_middleware_1.setupCorsMiddleware)(['*']));
    // Session configuration
    app.use((0, express_session_1.default)({
        secret: process.env.SESSION_SECRET || 'your-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
        },
    }));
    // Request logging
    app.use(request_logger_middleware_1.requestLogger);
    try {
        // Initialize database connection
        const dbConfig = database_factory_1.DatabaseFactory.createDatabaseConfig(database_interface_1.DatabaseType.POSTGRES);
        dataSource = await dbConfig.initialize();
        typedi_1.Container.set(typeorm_1.DataSource, dataSource);
        // Initialize module loader
        const moduleLoader = new module_loader_1.ModuleLoader(dataSource);
        await moduleLoader.loadModules([user_module_1.UserModule, auth_module_1.AuthModule, health_module_1.HealthModule]);
        // Initialize Passport
        (0, passport_1.configurePassport)();
        app.use(passport_1.passportMiddleware);
        app.use(passport_1.passportSessionMiddleware);
        // Get all registered routers for logging
        const registeredRouters = router_registry_1.routerRegistry.getAllRouters();
        // Register and log all routes
        (0, utils_1.registerAndLogRoutes)(app, registeredRouters, apiPrefix);
        // Global error handler
        (0, utils_1.setupGlobalErrorHandler)(app);
        // 404 handler
        (0, utils_1.setupNotFoundHandler)(app);
        logger.info('Application bootstrapped successfully');
        return { app, dataSource };
    }
    catch (error) {
        logger.error('Failed to bootstrap application:', error);
        throw error;
    }
};
exports.bootstrap = bootstrap;
/**
 * AWS Lambda handler function
 * @param event API Gateway event object
 * @param context AWS Lambda context object
 * @returns Promise<APIGatewayProxyResult> - Returns the API Gateway proxy result
 */
const handler = async (event, context) => {
    // Cold start handling
    if (!isWarm) {
        await (0, exports.bootstrap)();
        isWarm = true;
    }
    const { handler: routerHandler } = await Promise.resolve().then(() => __importStar(require('./lambda')));
    return routerHandler(event, context);
};
exports.handler = handler;
//# sourceMappingURL=bootstrap.js.map