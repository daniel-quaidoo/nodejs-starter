"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeORMQueryBuilder = void 0;
const typeorm_1 = require("typeorm");
class TypeORMQueryBuilder {
    buildFindOptions(query) {
        const { page = '1', limit = '10', sortBy, sortOrder, search, ...filters } = query;
        const options = {};
        const where = {};
        // Handle search
        if (search) {
            Object.assign(where, this.buildSearchCondition('name', search));
        }
        // Add other filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                where[key] = value;
            }
        });
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        // Add pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        options.skip = (pageNum - 1) * limitNum;
        options.take = limitNum;
        // Add sorting
        if (sortBy) {
            options.order = {
                [sortBy]: sortOrder || 'ASC',
            };
        }
        return options;
    }
    buildSearchCondition(field, search) {
        return {
            [field]: (0, typeorm_1.ILike)(`%${search}%`)
        };
    }
}
exports.TypeORMQueryBuilder = TypeORMQueryBuilder;
//# sourceMappingURL=typeorm-query.builder.js.map