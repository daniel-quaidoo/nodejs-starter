"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const express_1 = require("express");
// dto
const base_query_dto_1 = require("../dto/base-query.dto");
const base_response_dto_1 = require("../dto/base-response.dto");
// decorator
const route_decorator_1 = require("../decorators/route.decorator");
let BaseController = class BaseController {
    constructor(service) {
        this.service = service;
        this.router = (0, express_1.Router)();
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
    async create(req, res, next) {
        try {
            const entity = await this.service.create(req.body);
            res.status(201).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource created successfully'));
        }
        catch (error) {
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
    async findAll(req, res, next) {
        try {
            // Transform and validate query parameters
            const queryDto = (0, class_transformer_1.plainToInstance)(base_query_dto_1.BaseQueryDto, req.query);
            const errors = await (0, class_validator_1.validate)(queryDto);
            if (errors.length > 0) {
                const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
                res.status(400).json(base_response_dto_1.BaseResponseDto.error('Validation failed', errorMessages));
                return;
            }
            // Convert DTO to TypeORM options
            const options = queryDto.toFindOptions();
            // Get data from service
            let count = 0;
            let entities = [];
            if (typeof this.service.findAndCount === 'function') {
                [entities, count] = await this.service.findAndCount(options);
            }
            else if (typeof this.service.findAll === 'function') {
                entities = await this.service.findAll(options);
                count = entities.length;
            }
            else {
                throw new Error('Service does not implement required methods');
            }
            // Prepare pagination data
            const page = parseInt(queryDto.page || '1', 10);
            const limit = parseInt(queryDto.limit || '10', 10);
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entities, {
                page,
                limit,
                total: count
            }, 'Data retrieved successfully'));
        }
        catch (error) {
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
    async findById(req, res, next) {
        try {
            const entity = await this.service.findOne(req.params.id);
            if (!entity) {
                res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                return;
            }
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource retrieved successfully'));
        }
        catch (error) {
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
    async update(req, res, next) {
        try {
            const entity = await this.service.update(req.params.id, req.body);
            if (!entity) {
                res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                return;
            }
            res.status(200).json(base_response_dto_1.BaseResponseDto.success(entity, undefined, 'Resource updated successfully'));
        }
        catch (error) {
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
    async delete(req, res, next) {
        try {
            const success = await this.service.delete(req.params.id);
            if (!success) {
                if ('status' in res) {
                    res.status(404).json(base_response_dto_1.BaseResponseDto.error('Resource not found'));
                }
                else {
                    const error = new Error('Resource not found');
                    error.status = 404;
                    res(error);
                }
                return;
            }
            if ('status' in res) {
                res.status(200).json(base_response_dto_1.BaseResponseDto.success(null, undefined, 'Resource deleted successfully'));
            }
            else {
                res();
            }
        }
        catch (error) {
            if (next) {
                next(error);
            }
            else if ('status' in res) {
                res.status(500).json(base_response_dto_1.BaseResponseDto.error('Internal server error', error instanceof Error ? error.message : 'Unknown error'));
            }
            else {
                res(error);
            }
        }
    }
    /**
     * Get routes defined by decorators
     */
    getDecoratorRoutes() {
        const controller = this;
        const controllerPath = Reflect.getMetadata('basePath', controller.constructor) || '';
        const routeMetadata = (0, route_decorator_1.getRouteMetadata)(controller.constructor);
        return routeMetadata.map(route => ({
            method: route.method,
            path: `${controllerPath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/'),
            handler: (req, res, next) => controller[route.handlerName](req, res, next),
            middlewares: route.middlewares,
            absolutePath: true
        }));
    }
    /**
     * Get all routes (base + custom + decorator-based)
     */
    getRoutes() {
        const decoratorRoutes = this.getDecoratorRoutes();
        return [
            ...decoratorRoutes
        ];
    }
    /**
     * Register all routes (decorator-based, base, and custom)
     */
    initializeRoutes() {
        this.getRoutes().forEach(route => this.registerRoute(route));
    }
    registerRoute(route) {
        const fullPath = route.absolutePath
            ? route.path
            : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
        const method = route.method.toLowerCase();
        const middlewares = [...(route.middlewares || [])];
        this.router[method](fullPath, ...middlewares, (req, res, next) => {
            return route.handler ? route.handler(req, res, next) : undefined;
        });
    }
};
exports.BaseController = BaseController;
__decorate([
    (0, route_decorator_1.Post)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "create", null);
__decorate([
    (0, route_decorator_1.Get)(''),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "findAll", null);
__decorate([
    (0, route_decorator_1.Get)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "findById", null);
__decorate([
    (0, route_decorator_1.Put)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "update", null);
__decorate([
    (0, route_decorator_1.Delete)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "delete", null);
exports.BaseController = BaseController = __decorate([
    (0, route_decorator_1.Controller)(),
    __metadata("design:paramtypes", [Object])
], BaseController);
//# sourceMappingURL=base.controller.js.map