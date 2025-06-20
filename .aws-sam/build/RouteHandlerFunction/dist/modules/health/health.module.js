"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthModule = void 0;
// router
const health_router_1 = require("./router/health.router");
// service
const health_service_1 = require("./service/health.service");
// module
const module_decorator_1 = require("../../core/common/di/module.decorator");
// controller
const health_controller_1 = require("./controller/health.controller");
let HealthModule = class HealthModule {
};
exports.HealthModule = HealthModule;
exports.HealthModule = HealthModule = __decorate([
    (0, module_decorator_1.Module)({
        repositories: [],
        routers: [health_router_1.HealthRouter],
        controllers: [health_controller_1.HealthController],
        services: [health_service_1.HealthService],
    })
], HealthModule);
//# sourceMappingURL=health.module.js.map