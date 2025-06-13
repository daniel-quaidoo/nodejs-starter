"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
require("reflect-metadata");
const express_1 = require("express");
// decorator
const route_decorator_1 = require("../decorators/route.decorator");
class BaseRouter {
    constructor(controller) {
        this.controller = controller;
        this.router = (0, express_1.Router)();
        this.basePath = this.constructor.name.replace(/Router$/, '').toLowerCase();
        this.initializeRoutes();
    }
    /**
     * Get base routes for CRUD operations
     * Can be overridden by child classes to customize routes
     */
    getBaseRoutes() {
        return [
            {
                method: 'POST',
                path: `/${this.basePath}`,
                handler: (req, res, next) => this.controller.create(req, res, next),
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}`,
                handler: (req, res, next) => this.controller.findAll(req, res, next),
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}/:id`,
                handler: (req, res, next) => this.controller.findById(req, res, next),
                absolutePath: true
            },
            {
                method: 'PUT',
                path: `/${this.basePath}/:id`,
                handler: (req, res, next) => this.controller.update(req, res, next),
                absolutePath: true
            },
            {
                method: 'DELETE',
                path: `/${this.basePath}/:id`,
                handler: (req, res, next) => this.controller.delete(req, res, next),
                absolutePath: true
            }
        ];
    }
    /**
     * Get custom routes specific to the implementing class
     * Should be overridden by child classes to add custom routes
     */
    getCustomRoutes() {
        return [];
    }
    /**
     * Get routes defined by decorators
     */
    getDecoratorRoutes() {
        const controller = this.controller;
        const controllerPath = Reflect.getMetadata('basePath', controller.constructor) || '';
        const routeMetadata = (0, route_decorator_1.getRouteMetadata)(controller.constructor);
        return routeMetadata.map(route => ({
            method: route.method,
            path: `${controllerPath}${route.path ? `/${route.path}` : ''}`.replace(/\/+/g, '/'),
            handler: (req, res, next) => controller[route.handlerName](req, res, next),
            absolutePath: true
        }));
    }
    /**
     * Get all routes (base + custom + decorator-based)
     */
    getRoutes() {
        const decoratorRoutes = this.getDecoratorRoutes();
        const baseRoutes = this.getBaseRoutes();
        const customRoutes = this.getCustomRoutes();
        return [
            ...decoratorRoutes,
            ...baseRoutes,
            ...customRoutes
        ];
    }
    /**
     * Register all routes (decorator-based, base, and custom)
     */
    initializeRoutes() {
        this.getRoutes().forEach(route => {
            const fullPath = route.absolutePath
                ? route.path
                : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
            const method = route.method.toLowerCase();
            this.router[method](fullPath, (req, res, next) => {
                return route.handler ? route.handler(req, res, next) : undefined;
            });
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=base.router.js.map