import 'reflect-metadata';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';
import session from 'express-session';
import express, { Express } from 'express';

// logger
import { LoggerService } from './core/logging';

// config
import { ConfigService } from './config/configuration';

// module
import { AuthModule } from './modules/auth/auth.module';
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
import { setupCorsMiddleware } from './core/middleware/cors.middleware';
import { requestLogger } from './core/logging/request-logger.middleware';
import {
    configurePassport,
    passportMiddleware,
    passportSessionMiddleware,
} from './core/auth/passport';

// utils
import {
    registerAndLogRoutes,
    setupGlobalErrorHandler,
    setupNotFoundHandler,
} from './shared/utils';

let isWarm = false;
let dataSource: DataSource;
const logger = Container.get(LoggerService);

/**
 * Initializes the application services, database connections, etc.
 * @returns Promise<{ app: Express; dataSource: DataSource }> - Returns the Express app and DataSource
 */
export const bootstrap = async (): Promise<{ app: Express; dataSource: DataSource }> => {
    // Initialize configuration
    const configService = new ConfigService();
    Container.set(ConfigService, configService);

    // Register API routes
    const apiPrefix = configService.get('API_PREFIX') || '/api';

    // Initialize Express app
    const app = express();

    // Apply middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Enable CORS for all routes
    app.use(setupCorsMiddleware(['*']));

    // Session configuration
    app.use(
        session({
            secret: process.env.SESSION_SECRET || 'your-secret-key',
            resave: false,
            saveUninitialized: false,
            cookie: {
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000, // 24 hours
            },
        })
    );

    // Request logging
    app.use(requestLogger);

    try {
        // Initialize database connection
        const dbConfig = DatabaseFactory.createDatabaseConfig(DatabaseType.POSTGRES);
        dataSource = await dbConfig.initialize();
        Container.set(DataSource, dataSource);

        // Initialize module loader
        const moduleLoader = new ModuleLoader(dataSource);
        await moduleLoader.loadModules([UserModule, AuthModule, HealthModule]);

        // Initialize Passport
        configurePassport();
        app.use(passportMiddleware);
        app.use(passportSessionMiddleware);

        // Get all registered routers for logging
        const registeredRouters = routerRegistry.getAllRouters();

        // Register and log all routes
        registerAndLogRoutes(app, registeredRouters, apiPrefix);

        // Global error handler
        setupGlobalErrorHandler(app);

        // 404 handler
        setupNotFoundHandler(app);

        logger.info('Application bootstrapped successfully');
        return { app, dataSource };
    } catch (error) {
        logger.error('Failed to bootstrap application:', error as Record<string, any>);
        throw error;
    }
};

/**
 * AWS Lambda handler function
 * @param event API Gateway event object
 * @param context AWS Lambda context object
 * @returns Promise<APIGatewayProxyResult> - Returns the API Gateway proxy result
 */
export const handler = async (event: any, context: any): Promise<any> => {
    // Cold start handling
    if (!isWarm) {
        await bootstrap();
        isWarm = true;
    }

    const { handler: routerHandler } = await import('./lambda');

    return routerHandler(event, context);
};
