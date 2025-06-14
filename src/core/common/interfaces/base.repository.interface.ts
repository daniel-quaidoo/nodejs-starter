import { DeepPartial, FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult, DeleteResult } from 'typeorm';

// model
import { BaseModel } from '../entities/base.entity';

/** 
 * Base repository interface
 * @template T The type of the model
 */
export interface IBaseRepository<T extends BaseModel> {
    // Create
    create(entity: DeepPartial<T>): Promise<T>;
    
    // Read
    find(options?: FindManyOptions<T>): Promise<T[]>;
    findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]>;
    findOne(options: string | number | FindOneOptions<T>): Promise<T | null>;
    
    // Update
    update(id: string | number | FindOptionsWhere<T>, entity: DeepPartial<T>): Promise<UpdateResult | T | null>;
    
    // Delete
    delete(id: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;
    softDelete(id: string | number | FindOptionsWhere<T>): Promise<DeleteResult>;
    
    // Count
    count(options?: FindManyOptions<T>): Promise<number>;
}
