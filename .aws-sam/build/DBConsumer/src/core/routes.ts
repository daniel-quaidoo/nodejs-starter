import * as router from 'aws-lambda-router';

// config
import { ConfigService } from '../config/configuration';

// router registry
import { routerRegistry } from './common/router/router.registry';

// interfaces
import { RouteDefinition } from './common/interfaces/route.interface';

// utils
import { createLambdaHandler, wrapHandler, normalizePath } from '../shared/utils';

const configService = new ConfigService();
const API_PREFIX = (configService.get('API_PREFIX') || '/api').replace(/\/+$/, '');

const allRoutes = routerRegistry
    .getAllRouters()
    .flatMap((moduleRouter) =>
        moduleRouter.getRoutes().map((route: RouteDefinition) => ({
            method: route.method,
            path: `${API_PREFIX}${normalizePath(route.path)}`,
            action: wrapHandler(createLambdaHandler(route.handler)),
        }))
    );

export const routerConfig: router.RouteConfig = {
    proxyIntegration: {
        routes: allRoutes,
        cors: true,
        debug: false,
    },
};

export const handler = router.handler(routerConfig);