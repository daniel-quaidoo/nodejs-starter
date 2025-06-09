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

    async create(entity: Partial<T>): Promise<T> {
        return this.repository.create(entity as DeepPartial<T>);
    }

    async findAll(options?: FindManyOptions<T>): Promise<T[]> {
        const [items] = await this.repository.findAndCount(options);
        return items;
    }

    async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
        return this.repository.findAndCount(options);
    }

    async findOne(
        idOrConditions: string | number | FindOptionsWhere<T>,
        options?: FindOneOptions<T>
    ): Promise<T | null> {
        if (typeof idOrConditions === 'object') {
            return this.repository.findOne({
                where: idOrConditions,
                ...options,
            });
        }
        return this.repository.findOne({
            where: { id: idOrConditions } as any,
            ...options,
        });
    }

    async update(
        idOrConditions: string | number | FindOptionsWhere<T>,
        entity: Partial<T>
    ): Promise<T | null> {
        const result = await this.repository.update(idOrConditions, entity as DeepPartial<T>);
        return result as T | null;
    }

    async delete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<boolean> {
        const result = await this.repository.delete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }

    async softDelete(idOrConditions: string | number | FindOptionsWhere<T>): Promise<boolean> {
        const result = await this.repository.softDelete(idOrConditions);
        if (typeof result === 'boolean') {
            return result;
        }
        return result.affected ? result.affected > 0 : false;
    }

    async count(options?: FindManyOptions<T>): Promise<number> {
        return this.repository.count(options);
    }
}
