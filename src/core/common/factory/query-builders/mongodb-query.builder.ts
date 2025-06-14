import { IQueryBuilder } from '../../interfaces/query-builder.interface';

export class MongoDBQueryBuilder<T> implements IQueryBuilder<T> {
    /**
     * Builds find options for MongoDB
     * @param query The query parameters
     * @returns The find options
     */
    buildFindOptions(query: any): any {
        const { page = '1', limit = '10', sortBy, sortOrder, search, ...filters } = query;
        const options: any = {};
        const where: any = {};

        // handle search
        if (search) {
            Object.assign(where, this.buildSearchCondition('name', search));
        }

        // add other filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                where[key] = value;
            }
        });

        if (Object.keys(where).length > 0) {
            options.where = where;
        }

        // add pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        options.skip = (pageNum - 1) * limitNum;
        options.take = limitNum;

        // add sorting
        if (sortBy) {
            options.order = {
                [sortBy]: sortOrder === 'DESC' ? -1 : 1,
            };
        }

        return options;
    }

    buildSearchCondition(field: string, search: string): any {
        return {
            [field]: { $regex: search, $options: 'i' }
        };
    }
}
