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

    async create(entity: DeepPartial<T>): Promise<T> {
        const newEntity = this.repository.create(entity);
        return this.repository.save(newEntity);
    }

    async findAll(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }

    async find(options?: FindManyOptions<T>): Promise<T[]> {
        const [items] = await this.findAll(options);
        return items;
    }

    async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }

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

    async delete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult> {
        return this.softDelete(idOrConditions);
    }

    async softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<DeleteResult> {
        return this.repository.softDelete(idOrConditions as any);
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.repository.count({
            where: { deletedAt: null, ...options?.where } as any,
            ...options,
        });
    }
}
