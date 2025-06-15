"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDAO = void 0;
class BaseDAO {
    constructor(dataSource, entity) {
        this.dataSource = dataSource;
        this.entity = entity;
        this.repository = this.dataSource.getRepository(this.entity);
    }
    /**
     * Creates a new entity in the database
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity) {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }
    /**
     * Finds all entities in the database
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAll(options) {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
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
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
    }
    /**
     * Finds a single entity by ID or options
     * @param idOrOptions ID or find options
     * @returns The found entity or null
     */
    async findOne(idOrOptions) {
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            return this.repository.findOne({
                where: { id: idOrOptions, deletedAt: null },
            });
        }
        if ('where' in idOrOptions) {
            return this.repository.findOne({
                ...idOrOptions,
                where: { deletedAt: null, ...idOrOptions.where },
            });
        }
        return this.repository.findOne({ where: { ...idOrOptions, deletedAt: null } });
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
            const result = await this.repository.update(idOrConditions, updateData);
            if (!result.affected) {
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
        return this.softDelete(idOrConditions);
    }
    /**
     * Soft deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async softDelete(idOrConditions) {
        return this.repository.softDelete(idOrConditions);
    }
    /**
     * Counts the number of entities in the database
     * @param options Optional find options
     * @returns The count of entities
     */
    async count(options) {
        return this.repository.count({
            where: { deletedAt: null, ...options?.where },
            ...options,
        });
    }
}
exports.BaseDAO = BaseDAO;
//# sourceMappingURL=base.dao.js.map