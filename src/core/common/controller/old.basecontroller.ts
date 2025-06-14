import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { Request, Response, NextFunction, Router } from 'express';

// model
import { BaseModel } from '../entities/base.entity';

// dto
import { BaseQueryDto } from '../dto/base-query.dto';
import { BaseResponseDto } from '../dto/base-response.dto';

// decorator
import { Controller, Delete, Get, Post, Put, getRouteMetadata } from '../decorators/route.decorator';

// interfaces
import { IBaseService } from '../interfaces/base.service.interface';
import { RouteDefinition, HttpMethod, RouteMetadata } from '../interfaces/route.interface';
import { IBaseController as IBaseControllerInterface } from '../interfaces/base.controller.interface';
import { ROUTE_METADATA_KEY } from '../di/component.decorator';

@Controller()
export abstract class BaseController<T extends BaseModel> implements IBaseControllerInterface<T> {
    public router: Router;
    private basePath: string;

    constructor(protected service: IBaseService<T>) {
        this.router = Router();
        this.basePath = this.constructor.name.replace(/Controller$/, '').toLowerCase();
    }

    /**
    * Create a new user
    * @param req Request object containing user data in body
    * @param res Response object
    * @param next Next function
    * @returns Promise<void> - Returns the created user
    * @throws Error if user creation fails
    */
    @Post('')
    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await this.service.create(req.body);
            res.status(201).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource created successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get paginated list of all users
     * @param req Request object containing query parameters:
     *   - page: Current page number (default: 1)
     *   - limit: Number of items per page (default: 10)
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns a paginated list of users with metadata
     * @throws Error if database operation fails
     */
    @Get('')
    async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Transform and validate query parameters
            const queryDto = plainToInstance(BaseQueryDto, req.query);
            const errors = await validate(queryDto);

            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
                res.status(400).json(
                    BaseResponseDto.error('Validation failed', errorMessages)
                );
                return;
            }

            // Convert DTO to TypeORM options
            const options = queryDto.toFindOptions();

            // Get data from service
            let count = 0;
            let entities: any[] = [];

            if (typeof this.service.findAndCount === 'function') {
                [entities, count] = await (this.service as any).findAndCount(options);
            } else if (typeof this.service.findAll === 'function') {
                entities = await this.service.findAll(options);
                count = entities.length;
            } else {
                throw new Error('Service does not implement required methods');
            }

            // Prepare pagination data
            const page = parseInt(queryDto.page || '1', 10);
            const limit = parseInt(queryDto.limit || '10', 10);

            res.status(200).json(
                BaseResponseDto.success(
                    entities,
                    {
                        page,
                        limit,
                        total: count
                    },
                    'Data retrieved successfully'
                )
            );
        } catch (error: any) {
            next(error);
        }
    }


    /**
     * Get a single user by ID
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the requested user
     * @throws Error if user is not found or database operation fails
     */
    @Get('/:id')
    async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await (this.service as any).findOne(req.params.id);
            if (!entity) {
                res.status(404).json(
                    BaseResponseDto.error('Resource not found')
                );
                return;
            }
            res.status(200).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource retrieved successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing user
     * @param req Request object containing user ID in params and update data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the updated user
     * @throws Error if user is not found or update fails
     */
    @Put('/:id')
    async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const entity = await (this.service as any).update(req.params.id, req.body);
            if (!entity) {
                res.status(404).json(
                    BaseResponseDto.error('Resource not found')
                );
                return;
            }
            res.status(200).json(
                BaseResponseDto.success(
                    entity,
                    undefined,
                    'Resource updated successfully'
                )
            );
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a user
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns success message
     * @throws Error if user deletion fails
     */
    @Delete('/:id')
    async delete(req: Request, res: Response | NextFunction, next?: NextFunction): Promise<void> {
        try {
            const success = await (this.service as any).delete(req.params.id);
            if (!success) {
                if ('status' in res) {
                    res.status(404).json(
                        BaseResponseDto.error('Resource not found')
                    );
                } else {
                    // Handle the case where res is NextFunction
                    const error = new Error('Resource not found');
                    (error as any).status = 404;
                    (res as NextFunction)(error);
                }
                return;
            }

            if ('status' in res) {
                res.status(200).json(
                    BaseResponseDto.success(
                        null,
                        undefined,
                        'Resource deleted successfully'
                    )
                );
            } else {
                // If res is NextFunction, call it without arguments to proceed
                (res as NextFunction)();
            }
        } catch (error) {
            if (next) {
                next(error);
            } else if ('status' in res) {
                // If next is not provided but res is a Response, send the error
                (res as Response).status(500).json(
                    BaseResponseDto.error(
                        'Internal server error',
                        error instanceof Error ? error.message : 'Unknown error'
                    )
                );
            } else {
                (res as NextFunction)(error);
            }
        }
    }

    /**
     * Get base routes from the prototype chain
     */
    protected getBaseRoutes(): RouteDefinition[] {
        const baseRoutes = Object.getPrototypeOf(this).constructor !== BaseController
            ? Object.getPrototypeOf(Object.getPrototypeOf(this)).getBaseRoutes?.() || []
            : [];

        // Get decorator routes
        const decoratorRoutes = this.getDecoratorRoutes();

        // Combine and deduplicate routes (child routes take precedence)
        const routeMap = new Map<string, RouteDefinition>();

        // Add base routes first
        baseRoutes.forEach((route: RouteDefinition) => {
            const key = `${route.method}:${route.path}`;
            routeMap.set(key, route);
        });

        // Add/override with decorator routes
        decoratorRoutes.forEach(route => {
            const key = `${route.method}:${route.path}`;
            routeMap.set(key, route);
        });

        return Array.from(routeMap.values());
    }

    /**
     * Get routes defined by decorators
     */
    protected getDecoratorRoutes(): RouteDefinition[] {
        const controller = (this as any);
        const controllerPath = Reflect.getMetadata('basePath', controller.constructor) || '';
        const routeMetadata = getRouteMetadata(controller.constructor) as RouteMetadata[];

        return routeMetadata.map(route => ({
            method: route.method as HttpMethod,
            path: `${controllerPath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/'),
            handler: (req: Request, res: Response, next: NextFunction) =>
                controller[route.handlerName](req, res, next),
            middlewares: route.middlewares,
            absolutePath: true
        }));
    }

    protected getDecoratorRoutesNew(): RouteDefinition[] {
        const controller = this as any;
        const controllerPath = this.basePath;
        
        // Get methods from current class and all parent classes
        const getMethods = (obj: any, methods: string[] = []): string[] => {
            const proto = Object.getPrototypeOf(obj);
            if (proto === BaseController.prototype) {
                return methods;
            }
            const ownMethods = Object.getOwnPropertyNames(proto)
                .filter(name => name !== 'constructor' && typeof proto[name] === 'function');
            return getMethods(proto, [...methods, ...ownMethods]);
        };
    
        // Get all methods including inherited ones
        const allMethods = getMethods(this);
        const uniqueMethods = [...new Set(allMethods)];
    
        // Get route metadata for all methods
        const routeMetadata = uniqueMethods
            .map(methodName => {
                const route = Reflect.getMetadata(
                    ROUTE_METADATA_KEY,
                    controller,
                    methodName
                );
                return route ? { ...route, handlerName: methodName } : null;
            })
            .filter(Boolean);
    
        return routeMetadata.map(route => ({
            method: route.method as HttpMethod,
            path: `${controllerPath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/'),
            handler: (req: Request, res: Response, next: NextFunction) =>
                controller[route.handlerName](req, res, next),
            middlewares: route.middlewares,
            absolutePath: true
        }));
    }   

    /**
     * Get all routes (base + custom + decorator-based)
     */
    public getAllRoutes(): RouteDefinition[] {
        return this.getBaseRoutes();
    }

    /**
     * Register all routes (decorator-based, base, and custom)
     */
    protected initializeRoutes(): void {
        this.getAllRoutes().forEach((route: RouteDefinition) => this.registerRoute(route));
    }

    protected registerRoute(route: RouteDefinition) {
        const fullPath = route.absolutePath
            ? route.path
            : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;

        const method = route.method.toLowerCase() as Lowercase<HttpMethod>;
        const middlewares = [...(route.middlewares || [])];

        (this.router as any)[method](fullPath, ...middlewares,
            (req: Request, res: Response, next: NextFunction) => {
                return route.handler ? route.handler(req, res, next) : undefined;
            }
        );
    }

}