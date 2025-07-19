// entity
import { Category } from '../entities/category.entity';

// interface
import { IBaseRepository } from '@/core/common/interfaces/base.repository.interface';

/**
 * Interface for category repository
 * @extends IBaseRepository<Category>
 */
export interface ICategoryRepository extends IBaseRepository<Category> {
    findWithRelations(limit: number, offset: number): Promise<[Category[], number]>;
}
