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
exports.UserController = void 0;
const typedi_1 = require("typedi");
// service
const user_service_1 = require("../service/user.service");
const base_controller_1 = require("../../../core/common/controller/base.controller");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(userService) {
        super(userService);
        this.userService = userService;
    }
    /**
     * Find all users with pagination (overrides base method)
     */
    async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await this.userService.findAndCount({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                ...req.query
            });
            const [users, count] = result;
            const response = {
                success: true,
                data: users,
                meta: {
                    page: Number(page),
                    limit: Number(limit),
                    total: count,
                    totalPages: Math.ceil(count / Number(limit))
                }
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get user by ID (legacy method - kept for backward compatibility)
     */
    async getUserById(req, res, next) {
        try {
            const user = await this.userService.findOne(req.params.id);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Create a new user
     */
    async createUser(req, res, next) {
        try {
            const user = await this.userService.create(req.body);
            const response = {
                success: true,
                data: user,
                message: 'User created successfully'
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Update user by ID
     */
    async updateUser(req, res, next) {
        try {
            const user = await this.userService.update(req.params.id, req.body);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user,
                message: 'User updated successfully'
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete user by ID (soft delete)
     */
    async deleteUser(req, res, next) {
        try {
            await this.userService.delete(req.params.id);
            const response = {
                success: true,
                message: 'User deleted successfully'
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserController = UserController;
exports.UserController = UserController = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map