import { FindManyOptions, FindOneOptions, FindOptionsWhere, DeepPartial } from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

// interface
import { IBaseService } from '../interfaces/base.service.interface';
import { IBaseRepository } from '../interfaces/base.repository.interface';

export abstract class BaseService<T extends BaseModel> implements IBaseService<T> {
    protected repository: IBaseRepository<T>;

    constructor(repository: IBaseRepository<T>) {
        this.repository = repository;
    }

    /**
     * Create a new entity
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity: Partial<T>): Promise<T> {
        const createdEntity = await this.repository.create(entity as DeepPartial<T>);
        return createdEntity;
    }

    /**
     * Find all entities that match given options
     * @param options The options to find entities by
     * @returns The found entities
     */
    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        const [items] = await this.repository.findAndCount(options);
        return items;
    }

    /**
     * Find entities with pagination
     * @param options The options to find entities by
     * @returns The found entities
     */
    async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        const result = await this.repository.findAndCount(options);
        return result;
    }

    /**
     * Find a single entity by id or conditions
     * @param idOrConditions The id or conditions to find the entity by
     * @param options The options to find the entity by
     * @returns The found entity
     */
    async findOne(
        idOrConditions: string | number | FindOptionsWhere<T>,
        options?: FindOneOptions<T>
    ): Promise<T | null> {
        if (typeof idOrConditions === 'object') {
            const entity = await this.repository.findOne({
                where: idOrConditions,
                ...options,
            });
            return entity;
        }
        const entity = await this.repository.findOne({
            where: { id: idOrConditions } as any,
            ...options,
        });
        return entity;
    }

    /**
     * Update an entity by id or conditions
     * @param idOrConditions The id or conditions to update the entity by
     * @param entity The entity to update
     * @returns The updated entity
     */
    async update(
        idOrConditions: string | number | FindOptionsWhere<T>,
        entity: Partial<T>
    ): Promise<T | null> {
        const result = await this.repository.update(idOrConditions, entity as DeepPartial<T>);
        return result as T | null;
    }

    /**
     * Delete an entity by id or conditions
     * @param idOrConditions The id or conditions to delete the entity by
     * @returns Whether the entity was deleted
     */
    async delete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<boolean> {
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
    async softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<boolean> {
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
    async count(options?: FindManyOptions<T>): Promise<number> {
        const count = await this.repository.count(options);
        return count;
    }
}
