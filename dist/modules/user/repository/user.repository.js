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
exports.UserRepository = void 0;
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
// model
const user_entity_1 = require("../entities/user.entity");
// dao
const base_dao_1 = require("../../../core/common/dao/base.dao");
// decorator
const component_decorator_1 = require("../../../core/common/di/component.decorator");
let UserRepository = class UserRepository extends base_dao_1.BaseDAO {
    constructor() {
        const dataSource = typedi_1.Container.get(typeorm_1.DataSource);
        super(dataSource, user_entity_1.User);
    }
    /**
     * Finds a user by email
     * @param email The email of the user to find
     * @returns The user with the given email, or null if not found
     */
    async findByEmail(email) {
        const user = await this.repository.findOne({
            where: {
                email,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        return user;
    }
    /**
     * Finds all active users
     * @returns An array of active users
     */
    async findActiveUsers() {
        const users = await this.repository.find({
            where: {
                isActive: true,
                deletedAt: (0, typeorm_1.IsNull)(),
            },
        });
        return users;
    }
    /**
     * Checks if an email is taken
     * @param email The email to check
     * @param excludeId Optional ID to exclude from the check
     * @returns true if the email is taken, false otherwise
     */
    async isEmailTaken(email, excludeId) {
        const query = {
            email,
            deletedAt: (0, typeorm_1.IsNull)(),
        };
        if (excludeId) {
            query.id = (0, typeorm_1.Not)(excludeId);
        }
        const count = await this.repository.count({ where: query });
        return count > 0;
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, component_decorator_1.Component)({ type: component_decorator_1.COMPONENT_TYPE.REPOSITORY }),
    __metadata("design:paramtypes", [])
], UserRepository);
//# sourceMappingURL=user.repository.js.map