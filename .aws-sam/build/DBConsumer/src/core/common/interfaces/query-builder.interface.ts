import { FindManyOptions } from 'typeorm';

export interface IQueryBuilder<T> {
    buildFindOptions(query: any): FindManyOptions<T>;
    buildSearchCondition(field: string, search: string): any;
}
