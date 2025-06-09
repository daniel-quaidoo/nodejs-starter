import 'reflect-metadata';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import express, { Express, Request, Response, NextFunction } from 'express';

// utils
import { createErrorResponse } from './shared/utils';

// config
import { ConfigService } from './config/configuration';

// logger
import { LoggerService } from './core/logging/logger.service';

// router registry
import { routerRegistry } from './core/common/router/router.registry';

// factory
import { DatabaseFactory } from './core/db/factory/database.factory';

// interfaces
import { DatabaseType } from './core/db/interfaces/database.interface';

// middleware
import { requestLogger } from './core/logging/request-logger.middleware';

// modules
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';

// Module loader
import { getModuleMetadata } from './core/common/di/module.decorator';

// Controllers
import { UserController } from './modules/user/controller/user.controller';
import { HealthController } from './modules/health/controller/health.controller';

// Routers
import { UserRouter } from './modules/user/router/user.router';
import { HealthRouter } from './modules/health/router/health.router';
import { ModuleLoader } from './core/common/di/module.loader';

// For AWS Lambda
let isWarm = false;

let dataSource: DataSource;

// Initialize application services, database connections, etc.
export const bootstrap = async (): Promise<{ app: Express; dataSource: DataSource }> => {
    // Initialize configuration
    const configService = new ConfigService();
    Container.set(ConfigService, configService);

    // Initialize Express app
    const app = express();

    // Apply middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Enable CORS for all routes
    app.use((req: Request, res: Response, next: NextFunction) => {
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
    app.use(requestLogger);

    try {
        // Initialize database connection
        const dbConfig = DatabaseFactory.createDatabaseConfig(DatabaseType.POSTGRES);
        dataSource = await dbConfig.initialize();
        Container.set(DataSource, dataSource);
        
        // Initialize module loader
        const moduleLoader = new ModuleLoader(dataSource);
        await moduleLoader.loadModules([UserModule, HealthModule]);
        
        // Get all registered routers for logging
        const registeredRouters = routerRegistry.getAllRouters();
        
        // Log registered routers
        console.log('\n=== Registered Routers ===');
        if (registeredRouters.length === 0) {
            console.warn('No routers were registered! Check your router setup.');
        } else {
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
                router.router.stack.forEach((r: any) => {
                    if (r.route && r.route.path) {
                        const method = r.route.stack[0].method.toUpperCase();
                        console.log(`[${method}] ${apiPrefix}${r.route.path}`);
                    }
                });
            }
        });
        
        console.log('\n========================');
        
        // Global error handler
        app.use((err: any, req: any, res: any, next: any) => {
            const logger = Container.get(LoggerService);
            logger.error('Unhandled error', {
                error: err.message,
                stack: err.stack,
                url: req.originalUrl,
                method: req.method
            });
            
            res.status(err.statusCode || 500).json(createErrorResponse(500, err.message, req, {
                ...err,
                error: err.message,
                stack: err.stack,
                method: req.method,
                details: err.stack
            }));
        });
        
        // 404 handler
        app.use((req, res) => {
            res.status(404).json(createErrorResponse(404, 'Not Found', req));
        });

        console.log('Application bootstrapped successfully');
        return { app, dataSource };
    } catch (error) {
        console.error('Failed to bootstrap application:', error);
        throw error;
    }
};

export const handler = async (event: any, context: any) => {
    // Cold start handling
    if (!isWarm) {
        await bootstrap();
        isWarm = true;
    }

    const { handler: routerHandler } = await import('./core/routes');
    return routerHandler(event, context);
};