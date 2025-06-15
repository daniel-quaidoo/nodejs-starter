import {
    DeleteResult,
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    UpdateResult,
} from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

export interface IBaseDAO<T extends BaseModel> {
    /**
     * Create a new entity
     */
    create(entity: DeepPartial<T>): Promise<T>;

    /**
     * Find all entities that match given options
     */
    findAll(options?: FindManyOptions<T>): Promise<[T[], number]>;

    /**
     * Find entities that match given options
     */
    find(options?: FindManyOptions<T>): Promise<T[]>;

    /**
     * Find one entity by id or conditions
     */
    findOne(
        idOrOptions: string | number | FindOneOptions<T> | FindOptionsWhere<T>
    ): Promise<T | null>;

    /**
     * Update an entity by id or conditions
     */
    update(
        idOrConditions: string | number | FindOptionsWhere<T>,
        entity: DeepPartial<T>
    ): Promise<UpdateResult | T | null>;

    /**
     * Delete an entity by id or conditions (hard delete)
     */
    delete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;

    /**
     * Soft delete an entity by id or conditions
     */
    softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;

    /**
     * Count entities that match given conditions
     */
    count(options?: FindManyOptions<T>): Promise<number>;
}
