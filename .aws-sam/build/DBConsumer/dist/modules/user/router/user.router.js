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
var UserRouter_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const typedi_1 = require("typedi");
// controller
const user_controller_1 = require("../controller/user.controller");
// router
const base_router_1 = require("../../../core/common/router/base.router");
// token
const di_token_constant_1 = require("../../../core/common/di/di-token.constant");
// decorator
const component_decorator_1 = require("../../../core/common/di/component.decorator");
let UserRouter = UserRouter_1 = class UserRouter extends base_router_1.BaseRouter {
    constructor(controller) {
        super(controller);
        this.controller = controller;
        this.Token = di_token_constant_1.USER_ROUTER_TOKEN;
    }
    static getRouter() {
        const controller = typedi_1.Container.get(user_controller_1.UserController);
        return new UserRouter_1(controller).router;
    }
    /**
     * Override to add custom routes
     * These will be prefixed with '/user' automatically
     */
    getCustomRoutes() {
        return [
            {
                method: 'GET',
                path: '/users',
                handler: (req, res, next) => this.controller.getAllUsers(req, res, next),
                absolutePath: true
            },
            {
                method: 'POST',
                path: '/users',
                handler: (req, res, next) => this.controller.createUser(req, res, next),
                absolutePath: true
            }
        ];
    }
};
exports.UserRouter = UserRouter;
UserRouter.Token = di_token_constant_1.USER_ROUTER_TOKEN;
exports.UserRouter = UserRouter = UserRouter_1 = __decorate([
    (0, component_decorator_1.Component)({ type: component_decorator_1.COMPONENT_TYPE.ROUTER }),
    __param(0, (0, typedi_1.Inject)()),
    __metadata("design:paramtypes", [user_controller_1.UserController])
], UserRouter);
//# sourceMappingURL=user.router.js.map