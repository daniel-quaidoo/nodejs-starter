import 'reflect-metadata';
import { Router, Request, Response, NextFunction } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

// decorator
import { getRouteMetadata } from '../decorators/route.decorator';

// interface
import { IBaseController } from '../interfaces/base.controller.interface';
import { RouteDefinition, HttpMethod, RouteMetadata } from '../interfaces/route.interface';

export abstract class BaseRouter<T extends BaseModel> {
    public router: Router;
    private basePath: string;

    constructor(protected controller: IBaseController<T>) {
        this.router = Router();
        this.basePath = this.constructor.name.replace(/Router$/, '').toLowerCase();
        this.initializeRoutes();
    }

    /**
     * Gets the router
     * @returns The router
     */
    public getRouter(): Router {
        return this.router;
    }

    /**
     * Get base routes for CRUD operations
     * Can be overridden by child classes to customize routes
     */
    protected getBaseRoutes(): RouteDefinition[] {
        return [
            // {
            //     method: 'POST',
            //     path: `/${this.basePath}`,
            //     handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            //         if (!this.controller.create) {
            //             res.status(501).json({ message: 'Method not implemented' });
            //             return;
            //         }
            //         return this.controller.create(req, res, next);
            //     },
            //     absolutePath: true
            // },
            // {
            //     method: 'GET',
            //     path: `/${this.basePath}`,
            //     handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            //         if (!this.controller.findAll) {
            //             res.status(501).json({ message: 'Method not implemented' });
            //             return;
            //         }
            //         return this.controller.findAll(req, res, next);
            //     },
            //     absolutePath: true
            // },
            // {
            //     method: 'GET',
            //     path: `/${this.basePath}/:id`,
            //     handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            //         if (!this.controller.findById) {
            //             res.status(501).json({ message: 'Method not implemented' });
            //             return;
            //         }
            //         return this.controller.findById(req, res, next);
            //     },
            //     absolutePath: true
            // },
            // {
            //     method: 'PUT',
            //     path: `/${this.basePath}/:id`,
            //     handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            //         if (!this.controller.update) {
            //             res.status(501).json({ message: 'Method not implemented' });
            //             return;
            //         }
            //         return this.controller.update(req, res, next);
            //     },
            //     absolutePath: true
            // },
            // {
            //     method: 'DELETE',
            //     path: `/${this.basePath}/:id`,
            //     handler: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            //         if (!this.controller.delete) {
            //             res.status(501).json({ message: 'Method not implemented' });
            //             return;
            //         }
            //         return this.controller.delete(req, res, next);
            //     },
            //     absolutePath: true
            // }
        ];
    }

    /**
     * Get custom routes specific to the implementing class
     * Should be overridden by child classes to add custom routes
     */
    protected getCustomRoutes(): RouteDefinition[] {
        return [];
    }

    /**
     * Get routes defined by decorators
     */
    protected getDecoratorRoutes(): RouteDefinition[] {
        const controller = this.controller as any;
        const controllerPath = Reflect.getMetadata('basePath', controller.constructor) || '';
        const routeMetadata = getRouteMetadata(controller.constructor) as RouteMetadata[];

        return routeMetadata.map(route => ({
            method: route.method as HttpMethod,
            path: `${controllerPath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/'),
            handler: (req: Request, res: Response, next: NextFunction) =>
                controller[route.handlerName](req, res, next),
            middlewares: route.middlewares,
            absolutePath: true,
        }));
    }

    /**
     * Get all routes (base + custom + decorator-based)
     */
    public getRoutes(): RouteDefinition[] {
        const decoratorRoutes = this.getDecoratorRoutes();
        const baseRoutes = this.getBaseRoutes();
        const customRoutes = this.getCustomRoutes();

        return [...decoratorRoutes, ...baseRoutes, ...customRoutes];
    }

    /**
     * Register all routes (decorator-based, base, and custom)
     */
    protected initializeRoutes(): void {
        this.getRoutes().forEach(route => this.registerRoute(route));
    }

    /**
     * Register a single route
     * @param route The route to register
     */
    protected registerRoute(route: RouteDefinition): void {
        const fullPath = route.absolutePath
            ? route.path
            : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;

        const method = route.method.toLowerCase() as Lowercase<HttpMethod>;
        const middlewares = [...(route.middlewares || [])];

        (this.router as any)[method](
            fullPath,
            ...middlewares,
            (req: Request, res: Response, next: NextFunction) => {
                return route.handler ? route.handler(req, res, next) : undefined;
            }
        );
    }
}
