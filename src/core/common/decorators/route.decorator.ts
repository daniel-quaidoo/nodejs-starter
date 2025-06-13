// interface
import { RouteMetadata } from '../interfaces/route.interface';

// decorator
import { Component, COMPONENT_TYPE } from '../di/component.decorator';
import { RequestHandler, Router } from 'express';

const ROUTE_METADATA_KEY = 'routes';
const CONTROLLER_METADATA_KEY = 'controller';

export function Controller(basePath: string = '') {
    return function (target: any) {
        Component({ type: COMPONENT_TYPE.CONTROLLER })(target);
        Reflect.defineMetadata('basePath', basePath, target);

        // Store the base path in metadata
        Reflect.defineMetadata(CONTROLLER_METADATA_KEY, { basePath }, target);

        // Initialize routes array if it doesn't exist
        if (!Reflect.hasMetadata(ROUTE_METADATA_KEY, target)) {
            Reflect.defineMetadata(ROUTE_METADATA_KEY, [], target);
        }
    };
}

// export function Get(path: string = '') {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata('method', 'GET', target, propertyKey);
//         Reflect.defineMetadata('path', path, target, propertyKey);
//     };
// }

// export function Post(path: string = '') {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata('method', 'POST', target, propertyKey);
//         Reflect.defineMetadata('path', path, target, propertyKey);
//     };
// }

// export function Put(path: string = '') {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata('method', 'PUT', target, propertyKey);
//         Reflect.defineMetadata('path', path, target, propertyKey);
//     };
// }

// export function Delete(path: string = '') {
//     return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
//         Reflect.defineMetadata('method', 'DELETE', target, propertyKey);
//         Reflect.defineMetadata('path', path, target, propertyKey);
//     };
// }

export const Get = createMethodDecorator('GET');
export const Post = createMethodDecorator('POST');
export const Put = createMethodDecorator('PUT');
export const Delete = createMethodDecorator('DELETE');

function createMethodDecorator(method: string) {
    return (path: string = '', ...middlewares: RequestHandler[]): MethodDecorator => {
        return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
            const controllerClass = target.constructor;
            const routes = Reflect.getMetadata(ROUTE_METADATA_KEY, controllerClass) || [];
            
            console.log("method", method);
            console.log("path", path);
            console.log("propertyKey", propertyKey);
            console.log("middlewares", middlewares);
            console.log("controllerClass", controllerClass)
            routes.push({
                method,
                path,
                handlerName: propertyKey as string,
                middlewares
            });
            
            // Reflect.defineMetadata('method', method, target, propertyKey);
            // Reflect.defineMetadata('path', path, target, propertyKey);
            Reflect.defineMetadata(ROUTE_METADATA_KEY, routes, controllerClass);
        };
    };
}

export function getControllerMetadata(controller: any) {
    return Reflect.getMetadata(CONTROLLER_METADATA_KEY, controller.constructor) || { basePath: '' };
}

export function getControllerRoutes(controller: any): RouteMetadata[] {
    return Reflect.getMetadata(ROUTE_METADATA_KEY, controller.constructor) || [];
}

export function createControllerRouter(controller: any): Router {
    const router = Router();
    const routes = getControllerRoutes(controller);
    const { basePath } = getControllerMetadata(controller);

    routes.forEach(route => {
        const fullPath = `${basePath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/');
        const handler = controller[route.handlerName].bind(controller);
        const middlewares = route.middlewares || [];

        
        (router as any)[route.method.toLowerCase()](
            fullPath,
            ...middlewares,
            handler
        );
        // Reflect.defineMetadata('method', route.method, controller, route.handlerName);
        // Reflect.defineMetadata('path', route.path, controller, route.handlerName);

        console.log(`[${route.method}] ${fullPath} -> ${controller.constructor.name}.${route.handlerName}`);
    });

    return router;
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
