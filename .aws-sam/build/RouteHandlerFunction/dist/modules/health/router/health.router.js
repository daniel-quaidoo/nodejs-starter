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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthRouter = void 0;
const express_1 = require("express");
const typedi_1 = require("typedi");
// controller
const health_controller_1 = require("../controller/health.controller");
// HealthRouter token
const HEALTH_ROUTER_TOKEN = new typedi_1.Token('HealthRouter');
let HealthRouter = class HealthRouter {
    constructor(healthController) {
        this.healthController = healthController;
        this.router = (0, express_1.Router)();
        this.Token = HEALTH_ROUTER_TOKEN;
        this.initializeRoutes();
    }
    getRoutes() {
        const healthCheckHandler = async (event, context, next) => {
            try {
                // For Lambda, we call the getHealthStatus method directly
                const healthStatus = await this.healthController.checkHealth(event, context, next);
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(healthStatus)
                };
            }
            catch (error) {
                console.error('Health check failed:', error);
                const statusCode = error?.statusCode || 500;
                const errorMessage = error?.message || 'Internal Server Error';
                return {
                    statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': 'true'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: errorMessage,
                        data: {
                            statusCode,
                            timestamp: new Date().toISOString(),
                            path: event?.path || '',
                            method: event?.httpMethod || ''
                        },
                        ...(process.env.NODE_ENV === 'development' && error.stack && {
                            details: error.stack
                        })
                    }),
                    isBase64Encoded: false
                };
            }
        };
        return [
            {
                method: 'GET',
                path: '/health',
                handler: healthCheckHandler
            },
            {
                method: 'GET',
                path: '/liveness',
                handler: healthCheckHandler
            },
            {
                method: 'GET',
                path: '/readiness',
                handler: healthCheckHandler
            }
        ];
    }
    initializeRoutes() {
        this.getRoutes().forEach(route => {
            const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
            this.router[route.method.toLowerCase()](path, (req, res, next) => {
                return route.handler(req, res, next);
            });
        });
    }
};
exports.HealthRouter = HealthRouter;
HealthRouter.Token = HEALTH_ROUTER_TOKEN;
exports.HealthRouter = HealthRouter = __decorate([
    (0, typedi_1.Service)({ id: HEALTH_ROUTER_TOKEN }),
    __param(0, (0, typedi_1.Inject)(() => health_controller_1.HealthController)),
    __metadata("design:paramtypes", [health_controller_1.HealthController])
], HealthRouter);
//# sourceMappingURL=health.router.js.map