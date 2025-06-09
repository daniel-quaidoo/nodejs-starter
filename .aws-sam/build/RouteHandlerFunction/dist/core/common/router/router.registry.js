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
var RouterRegistry_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerRegistry = exports.RouterRegistry = void 0;
const typedi_1 = require("typedi");
let RouterRegistry = RouterRegistry_1 = class RouterRegistry {
    constructor() {
        this.routers = new Map();
    }
    static getInstance() {
        if (!RouterRegistry_1.instance) {
            RouterRegistry_1.instance = new RouterRegistry_1();
        }
        return RouterRegistry_1.instance;
    }
    registerRouter(token) {
        const router = typedi_1.Container.get(token);
        this.routers.set(token, router);
    }
    getAllRouters() {
        return Array.from(this.routers.values());
    }
};
exports.RouterRegistry = RouterRegistry;
exports.RouterRegistry = RouterRegistry = RouterRegistry_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], RouterRegistry);
exports.routerRegistry = RouterRegistry.getInstance();
//# sourceMappingURL=router.registry.js.map