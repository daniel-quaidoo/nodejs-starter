import { DataSource, DeleteResult, DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

// interfaces
import { IBaseDAO } from '../interfaces/base.dao.interface';

export abstract class BaseDAO<T extends BaseModel> implements IBaseDAO<T> {
    protected repository: Repository<T>;

    constructor(
        protected dataSource: DataSource,
        protected entity: new () => T
    ) {
        this.repository = this.dataSource.getRepository<T>(this.entity);
    }

    /**
     * Creates a new entity in the database
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity: DeepPartial<T>): Promise<T> {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }

    /**
     * Finds all entities in the database
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAll(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }

    /**
     * Finds entities in the database
     * @param options Optional find options
     * @returns Array of entities
     */
    async find(options?: FindManyOptions<T>): Promise<T[]> {
        const [items] = await this.findAll(options);
        return items;
    }

    /**
     * Finds entities in the database and returns the count
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }

    /**
     * Finds a single entity by ID or options
     * @param idOrOptions ID or find options
     * @returns The found entity or null
     */
    async findOne(idOrOptions: string | number | FindOneOptions<T> | FindOptionsWhere<T>): Promise<T | null> {
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            return this.repository.findOne({
                where: { id: idOrOptions, deletedAt: null } as any,
            });
        }

        if ('where' in idOrOptions) {
            return this.repository.findOne({
                ...idOrOptions,
                where: { deletedAt: null, ...idOrOptions.where } as any,
            });
        }

        return this.repository.findOne({ where: { ...idOrOptions, deletedAt: null } as any });
    }

    /**
     * Updates an entity in the database
     * @param idOrConditions ID or find options
     * @param entity The entity to update
     * @returns The updated entity or null
     */
    async update(
        idOrConditions: string | number | FindOptionsWhere<T>,
        entity: DeepPartial<T>
    ): Promise<UpdateResult | T | null> {
        const updateData = {
            ...entity,
            updatedAt: new Date(),
        } as DeepPartial<T>;

        if (typeof idOrConditions === 'string' || typeof idOrConditions === 'number') {
            const result = await this.repository.update(idOrConditions, updateData as any);
            if (!result.affected) {
                return null;
            }
            return this.findOne(idOrConditions);
        }

        const updateResult = await this.repository.update(idOrConditions as any, updateData as any);
        if (!updateResult.affected) {
            return null;
        }
        
        return this.repository.findOne({ where: idOrConditions as any });
    }

    /**
     * Deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async delete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult> {
        return this.softDelete(idOrConditions);
    }

    /**
     * Soft deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult> {
        return this.repository.softDelete(idOrConditions as any);
    }

    /**
     * Counts the number of entities in the database
     * @param options Optional find options
     * @returns The count of entities
     */
    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.repository.count({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }
}
