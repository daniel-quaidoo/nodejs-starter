"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.routerRegistry = exports.RouterRegistry = void 0;
const typedi_1 = require("typedi");
let RouterRegistry = class RouterRegistry {
    constructor() {
        // private static instance: RouterRegistry;
        // private routers: Map<Token<IModuleRouter>, IModuleRouter> = new Map();
        // private constructor() {}
        // public static getInstance(): RouterRegistry {
        //     if (!RouterRegistry.instance) {
        //         RouterRegistry.instance = new RouterRegistry();
        //     }
        //     return RouterRegistry.instance;
        // }
        // public registerRouter(token: Token<IModuleRouter>): void {
        //     const router = Container.get<IModuleRouter>(token);
        //     this.routers.set(token, router);
        // }
        // public getAllRouters(): IModuleRouter[] {
        //     return Array.from(this.routers.values());
        // }
        this.routers = new Map();
    }
    registerRouter(token, routerFactory) {
        this.routers.set(token, routerFactory);
    }
    getAllRouters() {
        return Array.from(this.routers.values()).map(factory => factory());
    }
    getRouter(token) {
        const factory = this.routers.get(token);
        return factory ? factory() : undefined;
    }
};
exports.RouterRegistry = RouterRegistry;
exports.RouterRegistry = RouterRegistry = __decorate([
    (0, typedi_1.Service)()
], RouterRegistry);
// export const routerRegistry = RouterRegistry.getInstance();
exports.routerRegistry = new RouterRegistry();
//# sourceMappingURL=router.registry.js.map