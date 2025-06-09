import { FindManyOptions, FindOptionsWhere, ILike, FindOperator } from 'typeorm';

// interface
import { IQueryBuilder } from '../../interfaces/query-builder.interface';

interface QueryParams {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    search?: string;
    [key: string]: any;
}

type WhereCondition<T> = {
    [P in keyof T]?: FindOperator<any> | any;
} | FindOperator<any>[];

export class TypeORMQueryBuilder<T> implements IQueryBuilder<T> {
    buildFindOptions(query: QueryParams): FindManyOptions<T> {
        const { page = '1', limit = '10', sortBy, sortOrder, search, ...filters } = query;
        const options: FindManyOptions<T> = {};
        const where: WhereCondition<T> = {};

        // Handle search
        if (search) {
            Object.assign(where, this.buildSearchCondition('name', search) as any);
        }

        // Add other filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                (where as any)[key] = value;
            }
        });

        if (Object.keys(where).length > 0) {
            options.where = where as FindOptionsWhere<T>;
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
            } as any;
        }

        return options;
    }

    buildSearchCondition(field: string, search: string): Record<string, any> {
        return {
            [field]: ILike(`%${search}%`)
        };
    }
}
