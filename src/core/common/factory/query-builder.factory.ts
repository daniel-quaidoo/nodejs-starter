// interface
import { IQueryBuilder } from '../interfaces/query-builder.interface';

// builder
import { TypeORMQueryBuilder } from './query-builders/typeorm-query.builder';
import { MongoDBQueryBuilder } from './query-builders/mongodb-query.builder';

export type DatabaseType = 'typeorm' | 'mongodb';
type BuilderConstructor<T> = new () => IQueryBuilder<T>;

export class QueryBuilderFactory {
    private static instance: QueryBuilderFactory;
    private builders: Map<DatabaseType, BuilderConstructor<any>> = new Map();

    private constructor() {
        this.builders.set('typeorm', TypeORMQueryBuilder);
        this.builders.set('mongodb', MongoDBQueryBuilder);
    }

    /**
     * Gets the singleton instance of the query builder factory
     */
    public static getInstance(): QueryBuilderFactory {
        if (!QueryBuilderFactory.instance) {
            QueryBuilderFactory.instance = new QueryBuilderFactory();
        }
        return QueryBuilderFactory.instance;
    }

    /**
     * Registers a query builder
     * @param type The type of the query builder
     * @param builder The query builder constructor
     */
    public register<T>(type: DatabaseType, builder: BuilderConstructor<T>): void {
        this.builders.set(type, builder);
    }

    /**
     * Creates a query builder
     * @param type The type of the query builder
     * @returns The query builder instance
     */
    public create<T>(type: DatabaseType): IQueryBuilder<T> {
        const Builder = this.builders.get(type);
        if (!Builder) {
            throw new Error(`No query builder registered for type: ${type}`);
        }
        return new Builder();
    }
}

export const queryBuilderFactory = QueryBuilderFactory.getInstance();