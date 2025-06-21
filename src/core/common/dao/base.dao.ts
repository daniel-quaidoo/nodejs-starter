import {
    DataSource,
    DeleteResult,
    DeepPartial,
    FindManyOptions,
    FindOneOptions,
    FindOptionsWhere,
    Repository,
    EntityManager,
} from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

// interface
import { IBaseDAO } from '../interfaces/base.dao.interface';

// exception
import { DuplicateEntryException } from '../exceptions/custom.exception';

export abstract class BaseDAO<T extends BaseModel> implements IBaseDAO<T> {
    protected repository: Repository<T>;

    constructor(
        protected dataSource: DataSource,
        protected entity: new () => T
    ) {
        this.repository = this.dataSource.getRepository<T>(this.entity);
    }

    /**
     * Returns the manager of the repository
     */
    get manager(): EntityManager {
        return this.repository.manager;
    }

    /**
     * Creates a new entity in the database
     * @param entity The entity to create
     * @returns The created entity
     */
    async create(entity: DeepPartial<T>): Promise<T> {
        try {
            const newEntity = this.repository.create(entity);
            return await this.repository.save(newEntity);
        } catch (error: any) {
            if (
                error.code === '23505' ||
                error.code === 'ER_DUP_ENTRY' ||
                error.name === 'QueryFailedError' ||
                error.message?.includes('duplicate key')
            ) {
                throw DuplicateEntryException.fromError(error);
            }

            throw error;
        }
    }

    /**
     * Finds all entities in the database
     * @param options Optional find options
     * @returns Array of entities and total count
     */
    async findAll(options?: FindManyOptions<T>): Promise<[T[], number]> {
        const result = await this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
        return result;
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
        const result = await this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
        return result;
    }

    /**
     * Finds a single entity by ID or options
     * @param idOrOptions ID or find options
     * @returns The found entity or null
     */
    async findOne(
        idOrOptions: string | number | FindOneOptions<T> | FindOptionsWhere<T>
    ): Promise<T | null> {
        if (typeof idOrOptions === 'string' || typeof idOrOptions === 'number') {
            const result = await this.repository.findOne({
                where: { id: idOrOptions, deletedAt: null } as any,
            });
            return result;
        }

        if ('where' in idOrOptions) {
            const result = await this.repository.findOne({
                ...idOrOptions,
                where: { deletedAt: null, ...idOrOptions.where } as any,
            });
            return result;
        }

        const result = await this.repository.findOne({
            where: { ...idOrOptions, deletedAt: null } as any,
        });
        return result;
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
    ): Promise<T | null> {
        const updateData = {
            ...entity,
            updatedAt: new Date(),
        } as DeepPartial<T>;

        if (typeof idOrConditions === 'string' || typeof idOrConditions === 'number') {
            const updateResult = await this.repository.update(idOrConditions, updateData as any);
            if (!updateResult.affected) {
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
        const result = await this.repository.delete(idOrConditions as any);
        return result;
    }

    /**
     * Soft deletes an entity from the database
     * @param idOrConditions ID or find options
     * @returns The deleted entity
     */
    async softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult> {
        const result = await this.repository.softDelete(idOrConditions as any);
        return result;
    }

    /**
     * Counts the number of entities in the database
     * @param options Optional find options
     * @returns The count of entities
     */
    async count(options?: FindManyOptions<T>): Promise<number> {
        const result = await this.repository.count({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
        return result;
    }

    save(entity: T): Promise<T> {
        return this.repository.save(entity);
    }
}
