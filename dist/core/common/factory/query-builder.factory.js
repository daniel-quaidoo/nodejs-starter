"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryBuilderFactory = exports.QueryBuilderFactory = void 0;
// builder
const typeorm_query_builder_1 = require("./query-builders/typeorm-query.builder");
const mongodb_query_builder_1 = require("./query-builders/mongodb-query.builder");
class QueryBuilderFactory {
    constructor() {
        this.builders = new Map();
        this.builders.set('typeorm', typeorm_query_builder_1.TypeORMQueryBuilder);
        this.builders.set('mongodb', mongodb_query_builder_1.MongoDBQueryBuilder);
    }
    /**
     * Gets the singleton instance of the query builder factory
     */
    static getInstance() {
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
    register(type, builder) {
        this.builders.set(type, builder);
    }
    /**
     * Creates a query builder
     * @param type The type of the query builder
     * @returns The query builder instance
     */
    create(type) {
        const Builder = this.builders.get(type);
        if (!Builder) {
            throw new Error(`No query builder registered for type: ${type}`);
        }
        return new Builder();
    }
}
exports.QueryBuilderFactory = QueryBuilderFactory;
exports.queryBuilderFactory = QueryBuilderFactory.getInstance();
//# sourceMappingURL=query-builder.factory.js.map