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

type WhereCondition<T> =
    | {
          [P in keyof T]?: FindOperator<any> | any;
      }
    | FindOperator<any>[];

export class TypeORMQueryBuilder<T> implements IQueryBuilder<T> {
    /**
     * Builds find options for TypeORM
     * @param query The query parameters
     * @returns The find options
     */
    buildFindOptions(query: QueryParams): FindManyOptions<T> {
        const { page = '1', limit = '10', sortBy, sortOrder, search, ...filters } = query;
        const options: FindManyOptions<T> = {};
        const where: WhereCondition<T> = {};

        // handle search
        if (search) {
            Object.assign(where, this.buildSearchCondition('name', search) as any);
        }

        // add other filters
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                (where as any)[key] = value;
            }
        });

        if (Object.keys(where).length > 0) {
            options.where = where as FindOptionsWhere<T>;
        }

        // add pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        options.skip = (pageNum - 1) * limitNum;
        options.take = limitNum;

        // add sorting
        if (sortBy) {
            options.order = {
                [sortBy]: sortOrder || 'ASC',
            } as any;
        }

        return options;
    }

    /**
     * Builds a search condition for TypeORM
     * @param field The field to search on
     * @param search The search term
     * @returns The search condition
     */
    buildSearchCondition(field: string, search: string): Record<string, any> {
        return {
            [field]: ILike(`%${search}%`),
        };
    }
}
