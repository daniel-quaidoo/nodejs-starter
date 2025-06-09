"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDBQueryBuilder = void 0;
class MongoDBQueryBuilder {
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
                [sortBy]: sortOrder === 'DESC' ? -1 : 1,
            };
        }
        return options;
    }
    buildSearchCondition(field, search) {
        return {
            [field]: { $regex: search, $options: 'i' }
        };
    }
}
exports.MongoDBQueryBuilder = MongoDBQueryBuilder;
//# sourceMappingURL=mongodb-query.builder.js.map