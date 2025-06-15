import Container from 'typedi';
import { NextFunction, Router } from 'express';

// logger
import { LoggerService } from '../../logging/logger.service';

// interface
import { IModuleRouter, RouteDefinition } from '../interfaces/route.interface';

// decorator
import { createControllerRouter, getControllerMetadata } from '../decorators/route.decorator';

const logger = Container.get(LoggerService);

export class ControllerRouter implements IModuleRouter {
    public Token: any;
    public router: Router;
    public routes: any[] = [];
    public controllerName: string;

    constructor(private readonly controller: any) {
        this.Token = controller.constructor;
        this.controllerName = controller.constructor.name;

        // initialize router and routes
        this.router = Router();
        this.initializeRoutes();
    }

    /**
     * Gets the routes for the controller
     * @returns The routes for the controller
     */
    public getRoutes(): RouteDefinition[] {
        logger.info(`Getting routes for controller: ${this.controller.constructor.name}`);
        logger.info(
            'Available methods on controller:',
            Object.getOwnPropertyNames(Object.getPrototypeOf(this.controller))
        );

        return this.routes.map(route => {
            const routeInfo = {
                path: route.path,
                method: route.method,
                hasHandler: !!route.handler,
                handlerName: route.handlerName,
                isHandlerFunction:
                    route.handlerName && typeof this.controller[route.handlerName] === 'function',
                middlewares: route.middlewares || [],
            };

            logger.info('Processing route:', routeInfo);

            // If we have a direct handler, use it and preserve its middlewares
            if (route.handler) {
                return {
                    method: route.method,
                    path: route.path,
                    handler: route.handler,
                    middlewares: route.middlewares || [],
                    handlerName: route.handlerName,
                };
            }

            // Create a handler that includes middlewares and calls the controller method
            const handler = async (
                req: Request,
                res: Response,
                next: NextFunction
            ): Promise<any> => {
                // TODO: fix type
                const methodName = route.handlerName?.replace('bound ', '');
                if (!methodName || typeof this.controller[methodName] !== 'function') {
                    throw new Error(
                        `Handler '${methodName}' is not a function in ${this.controller.constructor.name}`
                    );
                }

                try {
                    // Execute the controller method
                    const result = this.controller[methodName](req, res, next);

                    // Handle async handlers
                    if (result instanceof Promise) {
                        await result;
                    }
                } catch (error) {
                    next(error);
                }
            };

            return {
                method: route.method,
                path: route.path,
                handler,
                middlewares: route.middlewares || [],
                handlerName: route.handlerName,
            };
        });
    }

    /**
     * Initializes the routes for the controller
     */
    private initializeRoutes(): void | RouteDefinition[] {
        const { basePath } = getControllerMetadata(this.controller);
        const controllerRouter = createControllerRouter(this.controller, basePath);
        this.router.use('', controllerRouter);

        if (controllerRouter.stack) {
            this.routes = controllerRouter.stack
                .map((layer: any) => {
                    if (layer.route) {
                        const method = Object.keys(layer.route.methods)[0].toUpperCase();
                        const path = layer.route.path;
                        const handler = layer.route.stack[layer.route.stack.length - 1];
                        const handlerName = handler.name.replace('bound ', '');

                        // get middlewares from the route stack (all layers except the last one)
                        const middlewares = layer.route.stack
                            .slice(0, -1) // Exclude the final handler
                            .map((m: any) => m.handle) // Get the middleware functions
                            .filter((m: any) => m !== handler.handle); // Filter out the main handler

                        return {
                            method,
                            path,
                            handlerName,
                            handler: handler.handle,
                            middlewares: [...middlewares, ...(handler.middlewares || [])],
                        };
                    }
                    return null;
                })
                .filter(Boolean);
        }
    }
}
