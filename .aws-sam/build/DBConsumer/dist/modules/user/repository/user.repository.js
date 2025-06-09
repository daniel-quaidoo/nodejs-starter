"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
// model
const user_entity_1 = require("../entities/user.entity");
// dao
const base_dao_1 = require("../../../core/common/dao/base.dao");
class UserRepository extends base_dao_1.BaseDAO {
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
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map