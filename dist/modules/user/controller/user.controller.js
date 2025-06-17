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
exports.UserController = void 0;
const typedi_1 = require("typedi");
// dto
const create_user_dto_1 = require("../dto/create-user.dto");
// service
const user_service_1 = require("../service/user.service");
const health_service_1 = require("../../../modules/health/service/health.service");
// guard
const local_guard_1 = require("../../../core/auth/guards/local.guard");
// controller
const base_controller_1 = require("../../../core/common/controller/base.controller");
// decorator
const param_decorator_1 = require("../../../core/common/decorators/param.decorator");
const middleware_decorator_1 = require("../../../core/common/decorators/middleware.decorator");
const route_decorator_1 = require("../../../core/common/decorators/route.decorator");
let UserController = class UserController extends base_controller_1.BaseController {
    constructor(userService, healthService) {
        super(userService);
        this.userService = userService;
        this.healthService = healthService;
    }
    async healthCheck() {
        try {
            const healthCheck = await this.healthService.getHealthStatus();
            return healthCheck;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Get paginated list of all users
     * @param req Request object containing query parameters:
     *   - page: Current page number (default: 1)
     *   - limit: Number of items per page (default: 10)
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns a paginated list of users with metadata
     * @throws Error if database operation fails
     */
    async getAllUsers(req, res, next) {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await this.userService.findAndCount({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                ...req.query,
            });
            const [users, count] = result;
            const response = {
                success: true,
                data: users,
                meta: {
                    page: Number(page),
                    limit: Number(limit),
                    total: count,
                    totalPages: Math.ceil(count / Number(limit)),
                },
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Get a single user by ID
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the requested user
     * @throws Error if user is not found or database operation fails
     */
    async getUserById(req, res, next) {
        try {
            const user = await this.userService.findOne(req.params.id);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user,
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
    @UseMiddleware(validateDto(CreateUserDto))
    @Param('userId') userId:string,
    @Params() params: SomeType,
    @Body() dto: AssignRoleDto,
    @Query() pageOptionsDto: UserQueryPageOptionDto,
     * Create a new user
     * @param req Request object containing user data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the created user
     * @throws Error if user creation fails
     */
    async createUser(createUserDto, res, next) {
        try {
            console.log(createUserDto);
            const user = await this.userService.create(createUserDto.body);
            const response = {
                success: true,
                data: user,
                message: 'User created successfully',
            };
            res.status(201).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
    @UseMiddleware(validateDto(CreateUserDto))
    @Param('userId') userId:string,
    @Params() params: SomeType,
    @Body() dto: AssignRoleDto,
    @Query() pageOptionsDto: UserQueryPageOptionDto,
     * Create a new user
     * @param req Request object containing user data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the created user
     * @throws Error if user creation fails
     */
    async createUserTest(userId, id, createUserDto, query, params) {
        try {
            console.log("BODY::", createUserDto);
            console.log("PARAM::userId:", userId);
            console.log("PARAM::id:", id);
            console.log("QUERY::", query);
            console.log("PARAMS::", params);
            const user = await this.userService.create(createUserDto);
            const response = {
                success: true,
                data: user,
                message: 'User created successfully',
            };
            return response;
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * Update an existing user
     * @param req Request object containing user ID in params and update data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the updated user
     * @throws Error if user is not found or update fails
     */
    async updateUser(req, res, next) {
        try {
            const { id } = req.params;
            const updateData = req.body;
            // Validate that we have an ID and update data
            if (!id) {
                throw new Error('ID is required for update');
            }
            if (!updateData || Object.keys(updateData).length === 0) {
                throw new Error('No update data provided');
            }
            const user = await this.userService.updateUser(id, updateData);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user,
                message: 'User updated successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * Delete a user
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns success message
     * @throws Error if user deletion fails
     */
    async deleteUser(req, res, next) {
        try {
            await this.userService.delete(req.params.id);
            const response = {
                success: true,
                message: 'User deleted successfully',
            };
            res.status(200).json(response);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.UserController = UserController;
__decorate([
    (0, route_decorator_1.Get)('/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "healthCheck", null);
__decorate([
    (0, route_decorator_1.Get)('/all'),
    (0, middleware_decorator_1.UseMiddleware)((0, local_guard_1.authMiddleware)({ roles: ['admin'] })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getAllUsers", null);
__decorate([
    (0, route_decorator_1.Get)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserById", null);
__decorate([
    (0, route_decorator_1.Post)(''),
    __param(0, (0, param_decorator_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUser", null);
__decorate([
    (0, route_decorator_1.Post)('/:userId/another/:id'),
    __param(0, (0, param_decorator_1.Param)('userId')),
    __param(1, (0, param_decorator_1.Param)('id')),
    __param(2, (0, param_decorator_1.Body)()),
    __param(3, (0, param_decorator_1.Query)()),
    __param(4, (0, param_decorator_1.Params)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, create_user_dto_1.CreateUserDto, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUserTest", null);
__decorate([
    (0, route_decorator_1.Put)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    (0, route_decorator_1.Delete)('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
exports.UserController = UserController = __decorate([
    (0, route_decorator_1.Controller)('/user'),
    __param(0, (0, typedi_1.Inject)()),
    __param(1, (0, typedi_1.Inject)()),
    __metadata("design:paramtypes", [user_service_1.UserService,
        health_service_1.HealthService])
], UserController);
//# sourceMappingURL=user.controller.js.map