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
exports.HealthController = void 0;
// service
const health_service_1 = require("../service/health.service");
const route_decorator_1 = require("../../../core/common/decorators/route.decorator");
const middleware_decorator_1 = require("../../../core/common/decorators/middleware.decorator");
const local_guard_1 = require("../../../core/auth/guards/local.guard");
let HealthController = class HealthController {
    constructor(healthService) {
        this.healthService = healthService;
    }
    async getHealthStatus(_req, res) {
        try {
            const status = await this.healthService.getHealthStatus();
            res.status(200).json(status);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to get health status' });
        }
    }
    async checkHealth(_req, res, next) {
        try {
            const healthStatus = await this.getHealthStatus(_req, res);
            res.status(200).json(healthStatus);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, route_decorator_1.Get)('/status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getHealthStatus", null);
__decorate([
    (0, route_decorator_1.Get)('/check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "checkHealth", null);
exports.HealthController = HealthController = __decorate([
    (0, route_decorator_1.Controller)('/healthy'),
    (0, middleware_decorator_1.UseMiddleware)((0, local_guard_1.authMiddleware)({ roles: ['admin'] })),
    __metadata("design:paramtypes", [health_service_1.HealthService])
], HealthController);
//# sourceMappingURL=health.controller.js.map