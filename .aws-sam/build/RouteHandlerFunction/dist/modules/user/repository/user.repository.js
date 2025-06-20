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
    async findByEmail(email) {
        return this.repository.findOne({
            where: {
                email,
                deletedAt: (0, typeorm_1.IsNull)()
            }
        });
    }
    async findActiveUsers() {
        return this.repository.find({
            where: {
                isActive: true,
                deletedAt: (0, typeorm_1.IsNull)()
            }
        });
    }
    async isEmailTaken(email, excludeId) {
        const query = {
            email,
            deletedAt: (0, typeorm_1.IsNull)()
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