import { FindManyOptions, FindOneOptions, FindOptionsWhere } from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

export interface IBaseService<T extends BaseModel> {
    /**
     * Create a new entity
     */
    create(entity: Partial<T>): Promise<T>;

    /**
     * Find all entities that match given options
     */
    findAll(options?: FindManyOptions<T>): Promise<T[]>;

    /**
     * Find entities with pagination
     */
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;

    /**
     * Find a single entity by id or conditions
     */
    findOne(
        id: string | number | FindOptionsWhere<T>,
        options?: FindOneOptions<T>
    ): Promise<T | null>;

    /**
     * Update an entity by id or conditions
     */
    update(
        id: string | number | FindOptionsWhere<T>,
        entity: Partial<T>
    ): Promise<T | null>;

    /**
     * Delete an entity by id or conditions (soft delete)
     */
    delete(id: string | number | FindOptionsWhere<T>): Promise<boolean>;

    /**
     * Count entities that match given conditions
     */
    count(options?: FindManyOptions<T>): Promise<number>;
}
