"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDAO = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
// Optional: Simple in-memory cache
const cache = new node_cache_1.default({ stdTTL: 300 }); // 5 minute TTL
// exception
class BaseDAO {
    constructor(dataSource, entity) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.cache = cache;
        this.repository = this.dataSource.getRepository(this.entity);
    }
    /**
     * Returns the manager of the repository
     */
    get manager() {
        return this.repository.manager;
    }
    /**
     * Creates a new entity in the database
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity) {
        try {
            const newEntity = this.repository.create(entity);
            return await this.repository.save(newEntity);
        }
        catch (error) {
            // if (
            //     error.code === '23505' ||
            //     error.code === 'ER_DUP_ENTRY' ||
            //     error.name === 'QueryFailedError' ||
            //     error.message?.includes('duplicate key')
            // ) {
            //     throw DuplicateEntryException.fromError(error);
            // }
            throw error;
        }
    }
    /**
     * Finds all entities in the database
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAll(options) {
        const result = await this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
        return result;
    }
    /**
     * Finds entities in the database
     * @param options Optional find options
     * @returns Array of entities
     */
    async find(options) {
        const [items] = await this.findAll(options);
        return items;
    }
    /**
     * Finds entities in the database and returns the count
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAndCount(options) {
        const query = this.repository.createQueryBuilder('entity');
        if (options?.withDeleted) {
            query.withDeleted();
        }
        if (options?.where) {
            query.where(options.where);
        }
        // handle relations
        if (options?.relations) {
            if (Array.isArray(options.relations)) {
                options.relations.forEach(relation => {
                    query.leftJoinAndSelect(`entity.${relation}`, relation);
                });
            }
            else if (typeof options.relations === 'object') {
                Object.entries(options.relations).forEach(([relation, config]) => {
                    if (typeof config === 'string') {
                        query.leftJoinAndSelect(`entity.${relation}`, relation);
                    }
                    else if (config && typeof config === 'object') {
                        query.leftJoinAndSelect(`entity.${relation}`, config.alias || relation, config.condition, config.parameters);
                    }
                });
            }
        }
        // handle pagination
        if (options?.skip) {
            query.offset(options.skip);
        }
        if (options?.take) {
            query.limit(options.take);
        }
        // handle sorting
        if (options?.order) {
            Object.entries(options.order).forEach(([key, value]) => {
                query.addOrderBy(`entity.${key}`, value);
            });
        }
        const [items, total] = await Promise.all([query.getMany(), query.getCount()]);
        return [items, total];
    }
    /**
     * Finds a single entity by ID or options
     * @param options Find options
     * @returns The found entity or null
     */
    findOneWithRelations(options) {
        const query = this.repository.createQueryBuilder('entity').where(options.where);
        if (options.relations) {
            Object.entries(options.relations).forEach(([relation, config]) => {
                if (typeof config === 'string') {
                    query.leftJoinAndSelect(`entity.${relation}`, relation);
                }
                else {
                    query.leftJoinAndSelect(`entity.${relation}`, config.alias, config.condition, config.parameters);
                }
            });
        }
        return query.getOne();
    }
    /**
     * Finds a single entity by ID or options
     * @param idOrOptions ID or find options
     * @returns The found entity or null
     */
    findOne(idOrOptions, options = {}) {
        const { relations, withDeleted = false } = options;
        const query = this.repository.createQueryBuilder('entity');
        // Handle different input types
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            // Single ID case
            const primaryColumns = this.repository.metadata.primaryColumns;
            if (primaryColumns.length === 1) {
                const primaryColumn = primaryColumns[0].propertyName;
                query.where(`entity.${primaryColumn} = :id`, { id: idOrOptions });
            }
            else {
                throw new Error('Entity uses composite primary keys. Please provide a complete where condition object.');
            }
        }
        else if (idOrOptions !== null && typeof idOrOptions === 'object') {
            if ('where' in idOrOptions) {
                // Handle FindOneOptions
                query.where(idOrOptions.where);
            }
            else {
                // Handle FindOptionsWhere or plain object
                query.where(idOrOptions);
            }
        }
        // Handle soft deletes
        if (!withDeleted) {
            query.andWhere('entity.deletedAt IS NULL');
        }
        // Handle relations
        if (relations) {
            Object.entries(relations).forEach(([relation, config]) => {
                if (typeof config === 'string') {
                    query.leftJoinAndSelect(`entity.${relation}`, relation);
                }
                else {
                    query.leftJoinAndSelect(`entity.${relation}`, config.alias, config.condition, config.parameters);
                }
            });
        }
        return query.getOne();
    }
    /**
     * @deprecated Use findOne or findOneWithRelations instead
     */
    async findOneV1(idOrOptions) {
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            const result = await this.repository.findOne({
                where: { id: idOrOptions, deletedAt: null },
            });
            return result;
        }
        if ('where' in idOrOptions) {
            const result = await this.repository.findOne({
                ...idOrOptions,
                where: { deletedAt: null, ...idOrOptions.where },
            });
            return result;
        }
        const result = await this.repository.findOne({
            where: { ...idOrOptions, deletedAt: null },
        });
        return result;
    }
    /**
     * Updates an entity in the database
     * @param idOrConditions ID or find options
     * @param entity The entity to update
     * @returns The updated entity or null
     */
    async update(idOrConditions, entity) {
        const updateData = {
            ...entity,
            updatedAt: new Date(),
        };
        if (typeof idOrConditions === 'string' || typeof idOrConditions === 'number') {
            const updateResult = await this.repository.update(idOrConditions, updateData);
            if (!updateResult.affected) {
                return null;
            }
            return this.findOne(idOrConditions);
        }
        const updateResult = await this.repository.update(idOrConditions, updateData);
        if (!updateResult.affected) {
            return null;
        }
        return this.repository.findOne({ where: idOrConditions });
    }
    /**
     * Deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async delete(idOrConditions) {
        const result = await this.repository.delete(idOrConditions);
        return result;
    }
    /**
     * Soft deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async softDelete(idOrConditions) {
        const result = await this.repository.softDelete(idOrConditions);
        return result;
    }
    /**
     * Counts the number of entities in the database
     * @param options Optional find options
     * @returns The count of entities
     */
    async count(options) {
        const result = await this.repository.count({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
        return result;
    }
    save(entity) {
        return this.repository.save(entity);
    }
}
exports.BaseDAO = BaseDAO;
//# sourceMappingURL=base.dao.js.map