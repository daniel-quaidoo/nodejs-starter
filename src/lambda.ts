// routes.ts
import session from 'express-session';
import * as router from 'aws-lambda-router';

// auth
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { configurePassport, passportMiddleware, passportSessionMiddleware } from './core/auth/passport';

// config
import { ConfigService } from './config/configuration';

// router registry
import { routerRegistry } from './core/common/router/router.registry';

// interfaces
import { RouteDefinition } from './core/common/interfaces/route.interface';

// utils
import { createLambdaHandler, wrapHandler, normalizePath } from './shared/utils';

const configService = new ConfigService();
const API_PREFIX = (configService.get('API_PREFIX') || '/api').replace(/\/+$/, '');

// configure passport
configurePassport();

// create routes
const allRoutes = routerRegistry.getAllRouters().flatMap((moduleRouter) => {
    moduleRouter.router.use(passportMiddleware);
    moduleRouter.router.use(passportSessionMiddleware);

    if (typeof moduleRouter.getRoutes === 'function') {
        return moduleRouter.getRoutes().map((route: RouteDefinition) => {
            const fullPath = route.path.startsWith('/')
                ? route.path
                : `/${route.path}`;

            return {
                method: route.method,
                path: `${API_PREFIX}${normalizePath(fullPath)}`.replace(/\/+/g, '/'),
                middlewares: route.middlewares,
                action: wrapHandler(createLambdaHandler(route.handler)),
            };
        });
    }
    return [];
});

export const routerConfig: router.RouteConfig = {
    proxyIntegration: {
        routes: allRoutes,
        cors: true,
        debug: false,
    },
};

export const handler = router.handler(routerConfig);