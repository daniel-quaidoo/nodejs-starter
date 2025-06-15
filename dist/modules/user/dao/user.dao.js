"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDAO = void 0;
// model
const user_entity_1 = require("../entities/user.entity");
// dao
const base_dao_1 = require("../../../core/common/dao/base.dao");
/**
 * User DAO class
 * @extends BaseDAO<User>
 */
class UserDAO extends base_dao_1.BaseDAO {
    constructor(dataSource) {
        super(dataSource, user_entity_1.User);
    }
}
exports.UserDAO = UserDAO;
//# sourceMappingURL=user.dao.js.map