import { NextFunction, RequestHandler, Router } from 'express';

// decorator
import { Component, COMPONENT_TYPE, CONTROLLER_METADATA_KEY, ROUTE_METADATA_KEY } from '../di/component.decorator';

// interface
import { HttpMethod, RouteDefinition, RouteMetadata } from '../interfaces/route.interface';

export function Controller(basePath: string = '', options: { auth?: boolean | string[], roles?: string[] } = {}) {
    return function (target: any) {
        Component({ type: COMPONENT_TYPE.CONTROLLER })(target);
        Reflect.defineMetadata('basePath', basePath, target);

        // Store the base path in metadata
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { basePath, auth: {
            required: !!options.auth || !!options.roles?.length,
            roles: Array.isArray(options.auth) 
                ? options.auth 
                : (options.roles || [])
        } }, target);

        // Initialize routes array if it doesn't exist
        if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target)) {
            Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target);
        }
    };
}

export function createMethodDecoratorOld(method: string) {
    return (path: string = '', ...middlewares: RequestHandler[]): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const controllerClass = target.constructor;
            const routes: RouteDefinition[] = Reflect.getOwnMetadata(ROUTE_METADATA_KEY, controllerClass) || [];
            const routeDef: RouteDefinition = {
                method: method as HttpMethod,
                path,
                handlerName: propertyKey as string,
                handler: descriptor.value,
                middlewares
            };

            console.log('Registering route:', {
                controller: controllerClass.name,
                route: { ...routeDef, handlerName: propertyKey }
            });
            routes.push(routeDef);

            // Reflect.defineMetadata('method', method, target, propertyKey);
            // Reflect.defineMetadata('path', path, target, propertyKey);
            Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, controllerClass);
        };
    };
}

// In route.decorator.ts
export function createMethodDecorator(
    method: HttpMethod, 
    path: string = '',
    options: { auth?: boolean | string[], roles?: string[] } = {}
): any 
{
    return (path: string = '', ...middlewares: RequestHandler[]): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const controllerClass = target.constructor;
            const routes: RouteDefinition[] = Reflect.getOwnMetadata(ROUTE_METADATA_KEY, controllerClass) || [];
            const routeDef: RouteDefinition = {
                method: method as HttpMethod,
                path,
                handlerName: propertyKey as string,
                handler: descriptor.value,
                middlewares,
                auth: {
                    required: !!options.auth || !!options.roles?.length,
                    roles: Array.isArray(options.auth) 
                        ? options.auth 
                        : (options.roles || [])
                }
            };

            routes.push(routeDef);
            Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, controllerClass);
        };
    }
}

export function createControllerRouter(controller: any, basePath: string = ''): Router {
    const router = Router();
    const controllerClass = controller.constructor;
    const routes = getControllerRoutes(controller) || [];

    console.log(`Creating router for ${controllerClass.name} with ${routes.length} routes`);

    // Bind all controller methods to maintain 'this' context
    Object.getOwnPropertyNames(Object.getPrototypeOf(controller))
        .filter(prop => 
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
        
        // Create a handler that maintains the correct 'this' context
        const handler = async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (methodName) {
                    const method = controller[methodName];
                    if (typeof method === 'function') {
                        // Call the method with the controller as 'this'
                        const result = await method.call(controller, req, res, next);
                        // If the method didn't send a response, send the result as JSON
                        // TODO: FIX
                        // if (!res.headersSent && result !== undefined) {
                        //     res.json(result);
                        // }
                    } else {
                        throw new Error(`Handler '${methodName}' is not a function in ${controllerClass.name}`);
                    }
                } else {
                    throw new Error(`No handler or handlerName provided for route ${route.method.toUpperCase()} ${fullPath}`);
                }
            } catch (error) {
                next(error);
            }
        };

        const middlewares = route.middlewares || [];
        console.log(`Registering route: ${route.method.toUpperCase()} ${fullPath} -> ${methodName}`);
        
        // Register the route with the router
        (router as any)[route.method.toLowerCase()](fullPath, ...middlewares, handler);
    });

    return router;
}

export function getControllerMetadata(controller: any) {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, controller.constructor) || { basePath: '' };
}

export function getControllerRoutes(controller: any): RouteDefinition[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, controller.constructor) || [];
}

export function getRouteMetadata(target: any): RouteMetadata[] {
    const methods = Object.getOwnPropertyNames(target.prototype);
    return methods
        .filter(method => Reflect.getMetadata('method', target.prototype, method))
        .map(method => ({
            path: Reflect.getMetadata('path', target.prototype, method) || '',
            method: Reflect.getMetadata('method', target.prototype, method) || '',
            handlerName: method
        }));
}

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');