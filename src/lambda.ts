// routes.ts
import * as router from 'aws-lambda-router';

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

// create routes
const allRoutes = routerRegistry.getAllRouters().flatMap(moduleRouter => {
    if (typeof moduleRouter.getRoutes === 'function') {
        return moduleRouter.getRoutes().map((route: RouteDefinition) => {
            const fullPath = route.path.startsWith('/') ? route.path : `/${route.path}`;

            // Create a middleware chain that includes both route middlewares and the route handler
            const handlerChain = [...(route.middlewares || []), route.handler];

            // Create a handler that chains all middlewares
            const chainedHandler = (req: any, res: any, next: any): any => {
                const executeHandler = async (index: number): Promise<any> => {
                    try {
                        if (index >= handlerChain.length) return next();
                        const current = handlerChain[index];
                        if (current) {
                            await current(req, res, (err?: any) => {
                                if (err) return next(err);
                                executeHandler(index + 1);
                            });
                        } else {
                            executeHandler(index + 1);
                        }
                    } catch (error) {
                        next(error);
                    }
                };
                executeHandler(0);
            };

            return {
                method: route.method,
                path: `${API_PREFIX}${normalizePath(fullPath)}`.replace(/\/+/g, '/'),
                action: wrapHandler(createLambdaHandler(chainedHandler)),
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
