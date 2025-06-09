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
exports.UserService = void 0;
// repository
const user_repository_1 = require("../repository/user.repository");
// service
const base_service_1 = require("../../../core/common/service/base.service");
// decorator
const component_decorator_1 = require("../../../core/common/di/component.decorator");
// exceptions
const http_exception_1 = require("../../../core/common/exceptions/http.exception");
let UserService = class UserService extends base_service_1.BaseService {
    constructor(userRepository) {
        super(userRepository);
        this.userRepository = userRepository;
    }
    async create(userData) {
        if (userData.email && await this.userRepository.isEmailTaken(userData.email)) {
            throw new http_exception_1.ConflictException('Email already in use');
        }
        return this.userRepository.create(userData);
    }
    async updateUser(id, updateData) {
        if (updateData.email && await this.userRepository.isEmailTaken(updateData.email, id)) {
            throw new http_exception_1.ConflictException('Email already in use');
        }
        await this.userRepository.update(id, updateData);
        const updatedUser = await this.userRepository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new http_exception_1.NotFoundException('User not found after update');
        }
        return updatedUser;
    }
    async findByEmail(email) {
        return this.userRepository.findByEmail(email);
    }
    async findActiveUsers() {
        return this.userRepository.findActiveUsers();
    }
    async isEmailTaken(email, excludeId) {
        return this.userRepository.isEmailTaken(email, excludeId);
    }
    async findById(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new http_exception_1.NotFoundException('User not found');
        }
        return user;
    }
    async deleteUser(id) {
        await this.userRepository.softDelete(id);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, component_decorator_1.Component)({ type: component_decorator_1.COMPONENT_TYPE.SERVICE }),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map