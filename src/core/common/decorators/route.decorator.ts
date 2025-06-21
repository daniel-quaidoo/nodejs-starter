import { NextFunction, Request, RequestHandler, Response, Router } from 'express';

// decorator
import { Component } from '../di/component.decorator';

// middleware
import { createValidationMiddleware } from '../../middleware/validation.middleware';

// interface
import { COMPONENT_TYPE } from '../interfaces/module.interface';
import { HttpMethod, RouteDefinition, RouteMetadata } from '../interfaces/route.interface';

// constant
import {
    CONTROLLER_METADATA_KEY,
    ROUTE_METADATA_KEY,
    MIDDLEWARE_METADATA_KEY,
    BODY_METADATA_KEY,
    PARAM_METADATA_KEY,
    PARAMS_METADATA_KEY,
    QUERY_METADATA_KEY,
} from '../di/di-token.constant';

/**
 * Decorator to define a controller
 * @param basePath Base path for the controller
 * @param options Optional options for the controller
 */
export function Controller(
    basePath: string = '',
    options: { auth?: boolean | string[]; roles?: string[]; middlewares?: RequestHandler[] } = {}
) {
    return function (target: any): void {
        Component({ type: COMPONENT_TYPE.CONTROLLER })(target);
        Reflect.defineMetadata('basePath', basePath, target);

        // store class-level middlewares
        if (options.middlewares && options.middlewares.length > 0) {
            const existingMiddlewares = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target) || [];
            Reflect.defineMetadata(
                MIDDLEWARE_METADATA_KEY,
                [...existingMiddlewares, ...options.middlewares],
                target
            );
        }

        // store the base path in metadata
        Reflect.defineMetadata(
            CONTROLLER_METADATA_KEY,
            {
                basePath,
                auth: {
                    required: !!options.auth || !!options.roles?.length,
                    roles: Array.isArray(options.auth) ? options.auth : options.roles || [],
                },
            },
            target
        );

        // initialize routes array if it doesn't exist
        if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target)) {
            Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target);
        }
    };
}

/**
 * Decorator to define a route
 * @param method HTTP method for the route
 * @param path Path for the route
 * @param options Optional options for the route
 */
export function createMethodDecorator(
    method: HttpMethod,
    _path: string = '',
    options: { middlewares?: RequestHandler[] } = {}
): any {
    return (
        pathOrOptions: string | RequestHandler = '',
        ...middlewares: RequestHandler[]
    ): MethodDecorator => {
        const path = typeof pathOrOptions === 'string' ? pathOrOptions : _path;
        const actualMiddlewares =
            typeof pathOrOptions === 'function' ? [pathOrOptions, ...middlewares] : middlewares;

        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor): any => {
            const originalMethod = descriptor.value;
            const controllerClass = target.constructor;

            // Get parameter metadata
            const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
            const bodyParams = Reflect.getOwnMetadata(BODY_METADATA_KEY, target, propertyKey) || {};
            const queryParams =
                Reflect.getOwnMetadata(QUERY_METADATA_KEY, target, propertyKey) || {};
            const paramParams =
                Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || {};
            const paramsParams =
                Reflect.getOwnMetadata(PARAMS_METADATA_KEY, target, propertyKey) || {};

            // Create validation middlewares for each parameter type
            const validationMiddlewares = [
                bodyParams &&
                    Object.keys(bodyParams).length > 0 &&
                    createValidationMiddleware('body', bodyParams),
                queryParams &&
                    Object.keys(queryParams).length > 0 &&
                    createValidationMiddleware('query', queryParams),
                paramParams &&
                    Object.keys(paramParams).length > 0 &&
                    createValidationMiddleware('param', paramParams),
                paramsParams &&
                    Object.keys(paramsParams).length > 0 &&
                    createValidationMiddleware('params', paramsParams),
            ].filter(Boolean) as RequestHandler[];
            
            // Create the wrapped handler
            descriptor.value = async function (
                req: Request,
                res: Response,
                next: NextFunction
            ): Promise<any> {
                // Bind the request to the controller instance
                (this as any).req = req;
                (this as any).res = res;
                (this as any).next = next;

                try {
                    const args = new Array(paramTypes.length);

                    // Process @Body() parameters (already validated)
                    Object.entries(bodyParams).forEach(([index]) => {
                        const i = parseInt(index);
                        args[i] = req.body;
                    });

                    // Process @Query() parameters (already validated)
                    Object.entries(queryParams).forEach(([index]) => {
                        const i = parseInt(index);
                        args[i] = req.query;
                    });

                    // Process @Param() parameters (already validated)
                    Object.entries(paramParams).forEach(([index, { name }]: any) => {
                        const i = parseInt(index);
                        args[i] = req.params[name];
                    });

                    // Process @Params() parameter (already validated)
                    Object.entries(paramsParams).forEach(([index]) => {
                        const i = parseInt(index);
                        args[i] = req.params;
                    });

                    // Call the original method with transformed parameters
                    const result = await originalMethod.apply(this, args);

                    // If the method returns a value and response hasn't been sent, send it
                    if (!res.headersSent && result !== undefined) {
                        res.json(result);
                    }
                } catch (error) {
                    next(error);
                }
            };

            // Store route metadata
            const routes: RouteDefinition[] =
                Reflect.getOwnMetadata(ROUTE_METADATA_KEY, controllerClass) || [];

            const methodMiddlewares = propertyKey
                ? Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, controllerClass, propertyKey) || []
                : [];

            const classMiddlewares =
                Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, controllerClass) || [];

            const routeDef: RouteDefinition = {
                method,
                path,
                handlerName: propertyKey as string,
                handler: descriptor.value,
                middlewares: [
                    ...classMiddlewares,
                    ...methodMiddlewares,
                    ...validationMiddlewares,
                    ...(options.middlewares || []),
                    ...actualMiddlewares,
                ],
            };

            routes.push(routeDef);
            Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, controllerClass);
        };
    };
}

/**
 * Creates a router for a controller
 * @param controller The controller to create a router for
 * @param basePath Base path for the controller
 * @returns The router for the controller
 */
export function createControllerRouter(controller: any, basePath: string = ''): Router {
    const router = Router();
    const controllerClass = controller.constructor;
    const routes = getControllerRoutes(controller) || [];

    // Log route creation in development only
    if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.log(`Creating router for ${controllerClass.name} with ${routes.length} routes`);
    }

    // get class-level middlewares
    const classMiddlewares = Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, controllerClass) || [];

    // bind all controller methods to maintain 'this' context
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
        .filter(
            prop =>
                typeof controller[prop] === 'function' &&
                prop !== 'constructor' &&
                prop !== 'initializeRoutes'
        )
        .forEach(method => {
            controller[method] = controller[method].bind(controller);
        });

    routes.forEach(route => {
        const fullPath = `${basePath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/');
        const methodName = route.handlerName?.replace('bound ', '') || '';

        // combine class and method middlewares
        const routeMiddlewares = [...(classMiddlewares || []), ...(route.middlewares || [])];

        // apply all middlewares to the route
        const routeHandlers = [
            ...routeMiddlewares,
            async (req: Request, res: Response, next: NextFunction): Promise<void> => {
                try {
                    if (methodName) {
                        const method = controller[methodName];
                        if (typeof method === 'function') {
                            await method.call(controller, req, res, next);
                        }
                    }
                } catch (error) {
                    next(error);
                }
            },
        ].filter(Boolean);

        // Log route registration in development only
        if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(
                `Registering route: ${route.method.toUpperCase()} ${fullPath} -> ${methodName}`
            );
        }

        // register the route with the router
        (router as any)[route.method.toLowerCase()](fullPath, ...routeHandlers);
    });

    return router;
}

/**
 * Gets the controller metadata
 * @param controller The controller to get metadata for
 * @returns The controller metadata
 */
export function getControllerMetadata(controller: any): any {
    // TODO: Check return type
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, controller.constructor) || { basePath: '' };
}

/**
 * Gets the controller routes
 * @param controller The controller to get routes for
 * @returns The controller routes
 */
export function getControllerRoutes(controller: any): RouteDefinition[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, controller.constructor) || [];
}

/**
 * Gets the route metadata
 * @param target The target to get metadata for
 * @returns The route metadata
 */
export function getRouteMetadata(target: any): RouteMetadata[] {
    const methods = Object.getOwnPropertyNames(target.prototype);
    return methods
        .filter(method => Reflect.getMetadata('method', target.prototype, method))
        .map(method => ({
            path: Reflect.getMetadata('path', target.prototype, method) || '',
            method: Reflect.getMetadata('method', target.prototype, method) || '',
            handlerName: method,
            middlewares:
                Reflect.getMetadata(MIDDLEWARE_METADATA_KEY, target.prototype, method) || [],
        }));
}

// HTTP method decorators
export const Get = createMethodDecorator('GET');
export const Put = createMethodDecorator('PUT');
export const Post = createMethodDecorator('POST');
export const Patch = createMethodDecorator('PATCH');
export const Delete = createMethodDecorator('DELETE');
