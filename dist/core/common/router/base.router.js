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
    getRouter() {
        return this.router;
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
                handler: async (req, res, next) => {
                    if (!this.controller.create) {
                        res.status(501).json({ message: 'Method not implemented' });
                        return;
                    }
                    return this.controller.create(req, res, next);
                },
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}`,
                handler: async (req, res, next) => {
                    if (!this.controller.findAll) {
                        res.status(501).json({ message: 'Method not implemented' });
                        return;
                    }
                    return this.controller.findAll(req, res, next);
                },
                absolutePath: true
            },
            {
                method: 'GET',
                path: `/${this.basePath}/:id`,
                handler: async (req, res, next) => {
                    if (!this.controller.findById) {
                        res.status(501).json({ message: 'Method not implemented' });
                        return;
                    }
                    return this.controller.findById(req, res, next);
                },
                absolutePath: true
            },
            {
                method: 'PUT',
                path: `/${this.basePath}/:id`,
                handler: async (req, res, next) => {
                    if (!this.controller.update) {
                        res.status(501).json({ message: 'Method not implemented' });
                        return;
                    }
                    return this.controller.update(req, res, next);
                },
                absolutePath: true
            },
            {
                method: 'DELETE',
                path: `/${this.basePath}/:id`,
                handler: async (req, res, next) => {
                    if (!this.controller.delete) {
                        res.status(501).json({ message: 'Method not implemented' });
                        return;
                    }
                    return this.controller.delete(req, res, next);
                },
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
            middlewares: route.middlewares,
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
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=base.router.js.map