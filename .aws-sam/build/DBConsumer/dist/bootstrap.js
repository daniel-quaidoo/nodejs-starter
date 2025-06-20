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
const express_1 = __importDefault(require("express"));
// utils
const utils_1 = require("./shared/utils");
// config
const configuration_1 = require("./config/configuration");
// logger
const logger_service_1 = require("./core/logging/logger.service");
// router registry
const router_registry_1 = require("./core/common/router/router.registry");
// factory
const database_factory_1 = require("./core/db/factory/database.factory");
// interfaces
const database_interface_1 = require("./core/db/interfaces/database.interface");
// middleware
const request_logger_middleware_1 = require("./core/logging/request-logger.middleware");
// modules
const user_module_1 = require("./modules/user/user.module");
const health_module_1 = require("./modules/health/health.module");
const module_loader_1 = require("./core/common/di/module.loader");
// For AWS Lambda
let isWarm = false;
let dataSource;
// Initialize application services, database connections, etc.
const bootstrap = async () => {
    // Initialize configuration
    const configService = new configuration_1.ConfigService();
    typedi_1.Container.set(configuration_1.ConfigService, configService);
    // Initialize Express app
    const app = (0, express_1.default)();
    // Apply middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // Enable CORS for all routes
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).json({});
        }
        next();
    });
    // Request logging
    app.use(request_logger_middleware_1.requestLogger);
    try {
        // Initialize database connection
        const dbConfig = database_factory_1.DatabaseFactory.createDatabaseConfig(database_interface_1.DatabaseType.POSTGRES);
        dataSource = await dbConfig.initialize();
        typedi_1.Container.set(typeorm_1.DataSource, dataSource);
        // Initialize module loader
        const moduleLoader = new module_loader_1.ModuleLoader(dataSource);
        await moduleLoader.loadModules([user_module_1.UserModule, health_module_1.HealthModule]);
        // Get all registered routers for logging
        const registeredRouters = router_registry_1.routerRegistry.getAllRouters();
        // Log registered routers
        console.log('\n=== Registered Routers ===');
        if (registeredRouters.length === 0) {
            console.warn('No routers were registered! Check your router setup.');
        }
        else {
            registeredRouters.forEach(router => {
                console.log(`- ${router.constructor.name}`);
            });
        }
        // Register API routes
        const apiPrefix = configService.get('API_PREFIX') || '/api';
        // Log registered routes for debugging
        console.log('\n=== Registered Routes ===');
        // Register each router's routes with Express
        registeredRouters.forEach(router => {
            const routerName = router.constructor.name;
            console.log(`\n${routerName} Routes:`);
            // Register the router with Express
            app.use(apiPrefix, router.router);
            // Log the routes for debugging
            if (router.router && router.router.stack) {
                router.router.stack.forEach((r) => {
                    if (r.route && r.route.path) {
                        const method = r.route.stack[0].method.toUpperCase();
                        console.log(`[${method}] ${apiPrefix}${r.route.path}`);
                    }
                });
            }
        });
        console.log('\n========================');
        // Global error handler
        app.use((err, req, res, next) => {
            const logger = typedi_1.Container.get(logger_service_1.LoggerService);
            logger.error('Unhandled error', {
                error: err.message,
                stack: err.stack,
                url: req.originalUrl,
                method: req.method
            });
            res.status(err.statusCode || 500).json((0, utils_1.createErrorResponse)(500, err.message, req, {
                ...err,
                error: err.message,
                stack: err.stack,
                method: req.method,
                details: err.stack
            }));
        });
        // 404 handler
        app.use((req, res) => {
            res.status(404).json((0, utils_1.createErrorResponse)(404, 'Not Found', req));
        });
        console.log('Application bootstrapped successfully');
        return { app, dataSource };
    }
    catch (error) {
        console.error('Failed to bootstrap application:', error);
        throw error;
    }
};
exports.bootstrap = bootstrap;
const handler = async (event, context) => {
    // Cold start handling
    if (!isWarm) {
        await (0, exports.bootstrap)();
        isWarm = true;
    }
    const { handler: routerHandler } = await Promise.resolve().then(() => __importStar(require('./core/routes')));
    return routerHandler(event, context);
};
exports.handler = handler;
//# sourceMappingURL=bootstrap.js.map