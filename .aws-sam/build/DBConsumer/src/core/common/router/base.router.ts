import { Router, Request, Response, NextFunction } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

// interfaces
import { IBaseController } from '../interfaces/base.controller.interface';
import { RouteDefinition, HttpMethod } from '../interfaces/route.interface';

export abstract class BaseRouter<T extends BaseModel> {
    public router: Router;
    private basePath: string;

    constructor(protected controller: IBaseController<T>) {
        this.router = Router();
        this.basePath = this.constructor.name.replace(/Router$/, '').toLowerCase();
        this.initializeRoutes();
    }

    /**
     * Get base routes for CRUD operations
     * Can be overridden by child classes to customize routes
     */
    protected getBaseRoutes(): RouteDefinition[] {
        return [
            {
                method: 'POST',
                path: `/${this.basePath}`,
                handler: (req: Request, res: Response, next: NextFunction) => 
                    this.controller.create(req, res, next),
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}`,
                handler: (req: Request, res: Response, next: NextFunction) => 
                    this.controller.findAll(req, res, next),
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}/:id`,
                handler: (req: Request, res: Response, next: NextFunction) => 
                    this.controller.findById(req, res, next),
                absolutePath: true
            },
            {
                method: 'PUT',
                path: `/${this.basePath}/:id`,
                handler: (req: Request, res: Response, next: NextFunction) => 
                    this.controller.update(req, res, next),
                absolutePath: true
            },
            {
                method: 'DELETE',
                path: `/${this.basePath}/:id`,
                handler: (req: Request, res: Response, next: NextFunction) => 
                    this.controller.delete(req, res, next),
                absolutePath: true
            }
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
     * Get all routes (base + custom)
     */
    public getRoutes(): RouteDefinition[] {
        return [
            ...this.getBaseRoutes(),
            ...this.getCustomRoutes()
        ];
    }

    /**
     * Initialize routes in the Express router
     */
    protected initializeRoutes(): void {
        this.getRoutes().forEach(route => {
            const fullPath = route.absolutePath 
                ? route.path 
                : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
                
            const method = route.method.toLowerCase() as Lowercase<HttpMethod>;
            
            (this.router as any)[method](fullPath, 
                (req: Request, res: Response, next: NextFunction) => {
                    return route.handler(req, res, next);
                }
            );
        });
    }

    public getRouter(): Router {
        return this.router;
    }
}
