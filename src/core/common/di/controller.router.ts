import { Token } from 'typedi';
import { NextFunction, Router } from 'express';

// decorator
import { createControllerRouter, getControllerMetadata } from '../decorators/route.decorator';

// interface
import { IModuleRouter, RouteDefinition } from '../interfaces/route.interface';

// export const CONTROLLER_ROUTER_TOKEN = new Token<ControllerRouter>('ControllerRouter');

export class ControllerRouter implements IModuleRouter {
    public Token: any;
    public router: Router;
    public routes: any[] = [];
    public controllerName: string;

    // public Token = CONTROLLER_ROUTER_TOKEN;
    // public static Token = CONTROLLER_ROUTER_TOKEN;

    constructor(private readonly controller: any) {
        this.router = Router();
        this.Token = controller.constructor;
        this.controllerName = controller.constructor.name;
        this.initializeRoutes();
    }

    // public getRoutes(): RouteDefinition[] {
    //     return this.routes.map(route => ({
    //         ...route,
    //         handler: (req: Request, res: Response, next: NextFunction) => {
    //             return this.controller[route.handlerName](req, res, next);
    //         }
    //     }));
    // }
    public getRoutes(): RouteDefinition[] {

        console.log(`Getting routes for controller: ${this.controller.constructor.name}`);
        console.log('Available methods on controller:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.controller)));

        return this.routes.map(route => {
            console.log('Processing route:', {
                path: route.path,
                method: route.method,
                hasHandler: !!route.handler,
                handlerName: route.handlerName,
                isHandlerFunction: route.handlerName && typeof this.controller[route.handlerName] === 'function'
            });
            // If we have a direct handler, use it
            if (route.handler) {
                return {
                    ...route,
                    handler: route.handler
                };
            }

            // Otherwise, create a handler that calls the controller method
            return {
                ...route,
                handler: (req: Request, res: Response, next: NextFunction) => {
                    const methodName = route.handlerName?.replace('bound ', '');
                    if (!methodName || typeof this.controller[methodName] !== 'function') {
                        throw new Error(`Handler '${methodName}' is not a function in ${this.controller.constructor.name}`);
                    }
                    return this.controller[methodName](req, res, next);
                }
            };
            // If we have a direct handler, use it
            // if (route.handler) {
            //     return route;
            // }


            // validate route
            // this.validateRoute(route);

            // Otherwise, create a handler that calls the controller method
            // return {
            //     ...route,
            //     handler: (req: Request, res: Response, next: NextFunction) => {
            //         return this.controller[route.handlerName!](req, res, next);
            //     }
            // };
        });
    }

    private validateRoute(route: RouteDefinition) {
        if (!route.handlerName) {
            throw new Error(`Route ${route.method.toUpperCase()} ${route.path} is missing both handler and handlerName`);
        }

        if (typeof this.controller[route.handlerName] !== 'function') {
            throw new Error(`Handler '${route.handlerName}' is not a function in ${this.controller.constructor.name}. Available methods: ${Object.getOwnPropertyNames(Object.getPrototypeOf(this.controller)).join(', ')}`);
        }
    }


    private initializeRoutes() {
        const { basePath } = getControllerMetadata(this.controller);
        const controllerRouter = createControllerRouter(this.controller, basePath);
        this.router.use('', controllerRouter);

        // if (controllerRouter.stack) {
        //     this.routes = controllerRouter.stack.map((layer: any) => {
        //         if (layer.route) {
        //             return {
        //                 method: Object.keys(layer.route.methods)[0].toUpperCase(),
        //                 path: layer.route.path,
        //                 handlerName: layer.route.stack[layer.route.stack.length - 1].name
        //             };
        //         }
        //         return null;
        //     }).filter(Boolean);
        // }
        if (controllerRouter.stack) {
            this.routes = controllerRouter.stack
                .map((layer: any) => {
                    if (layer.route) {
                        const method = Object.keys(layer.route.methods)[0].toUpperCase();
                        const path = layer.route.path;
                        const handler = layer.route.stack[layer.route.stack.length - 1];
                        const handlerName = handler.name.replace('bound ', '');

                        return {
                            method,
                            path,
                            handlerName,
                            handler: handler.handle // Store the actual handler function
                        };
                    }
                    return null;
                })
                .filter(Boolean);
        }
    }
}