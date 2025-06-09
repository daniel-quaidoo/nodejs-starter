import 'reflect-metadata';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import express, { Express } from 'express';

// config
import { ConfigService } from './config/configuration';

// modules
import { UserModule } from './modules/user/user.module';
import { HealthModule } from './modules/health/health.module';

// loader
import { ModuleLoader } from './core/common/di/module.loader';

// factory
import { DatabaseFactory } from './core/db/factory/database.factory';

// router registry
import { routerRegistry } from './core/common/router/router.registry';

// interfaces
import { DatabaseType } from './core/db/interfaces/database.interface';

// middleware
import { requestLogger } from './core/logging/request-logger.middleware';

// utils
import { registerAndLogRoutes, setupCorsMiddleware, setupGlobalErrorHandler, setupNotFoundHandler } from './shared/utils';

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
    app.use(setupCorsMiddleware(['*']));

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
        
        // Register API routes
        const apiPrefix = configService.get('API_PREFIX') || '/api';
        
        // Register and log all routes
        registerAndLogRoutes(app, registeredRouters, apiPrefix);
        
        // Global error handler
        setupGlobalErrorHandler(app);
        
        // 404 handler
        setupNotFoundHandler(app);

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