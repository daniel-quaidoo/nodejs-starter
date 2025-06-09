"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRouter = void 0;
const express_1 = require("express");
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
     * Get all routes (base + custom)
     */
    getRoutes() {
        return [
            ...this.getBaseRoutes(),
            ...this.getCustomRoutes()
        ];
    }
    /**
     * Initialize routes in the Express router
     */
    initializeRoutes() {
        this.getRoutes().forEach(route => {
            const fullPath = route.absolutePath
                ? route.path
                : `/${this.basePath}${route.path.startsWith('/') ? '' : '/'}${route.path}`;
            const method = route.method.toLowerCase();
            this.router[method](fullPath, (req, res, next) => {
                return route.handler(req, res, next);
            });
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.BaseRouter = BaseRouter;
//# sourceMappingURL=base.router.js.map