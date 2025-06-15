"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
class BaseService {
    constructor(repository) {
        this.repository = repository;
    }
    /**
     * Create a new entity
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity) {
        return this.repository.create(entity);
    }
    /**
     * Find all entities that match given options
     * @param options The options to find entities by
     * @returns The found entities
     */
    async findAll(options) {
        const [items] = await this.repository.findAndCount(options);
        return items;
    }
    /**
     * Find entities with pagination
     * @param options The options to find entities by
     * @returns The found entities
     */
    async findAndCount(options) {
        return this.repository.findAndCount(options);
    }
    /**
     * Find a single entity by id or conditions
     * @param idOrConditions The id or conditions to find the entity by
     * @param options The options to find the entity by
     * @returns The found entity
     */
    async findOne(idOrConditions, options) {
        if (typeof idOrConditions === 'object') {
            return this.repository.findOne({
                where: idOrConditions,
                ...options,
            });
        }
        return this.repository.findOne({
            where: { id: idOrConditions },
            ...options,
        });
    }
    /**
     * Update an entity by id or conditions
     * @param idOrConditions The id or conditions to update the entity by
     * @param entity The entity to update
     * @returns The updated entity
     */
    async update(idOrConditions, entity) {
        const result = await this.repository.update(idOrConditions, entity);
        return result;
    }
    /**
     * Delete an entity by id or conditions
     * @param idOrConditions The id or conditions to delete the entity by
     * @returns Whether the entity was deleted
     */
    async delete(idOrConditions) {
        const result = await this.repository.delete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }
    /**
     * Soft delete an entity by id or conditions
     * @param idOrConditions The id or conditions to soft delete the entity by
     * @returns Whether the entity was soft deleted
     */
    async softDelete(idOrConditions) {
        const result = await this.repository.softDelete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }
    /**
     * Count entities that match given conditions
     * @param options The options to count entities by
     * @returns The count of entities
     */
    async count(options) {
        return this.repository.count(options);
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map