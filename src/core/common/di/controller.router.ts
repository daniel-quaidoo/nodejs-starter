import { Token } from 'typedi';
import { NextFunction, Router } from 'express';

// decorator
import { createControllerRouter } from '../decorators/route.decorator';

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

    public getRoutes(): RouteDefinition[] {
        return this.routes.map(route => ({
            ...route,
            handler: (req: Request, res: Response, next: NextFunction) => {
                return this.controller[route.handlerName](req, res, next);
            }
        }));
    }

    private initializeRoutes() {
        const controllerRouter = createControllerRouter(this.controller);
        this.router.use('', controllerRouter);

        if (controllerRouter.stack) {
            this.routes = controllerRouter.stack.map((layer: any) => {
                if (layer.route) {
                    return {
                        method: Object.keys(layer.route.methods)[0].toUpperCase(),
                        path: layer.route.path
                    };
                }
                return null;
            }).filter(Boolean);
        }
    }
}