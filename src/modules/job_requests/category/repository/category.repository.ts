import Container from 'typedi';
import { DataSource } from 'typeorm';

// dao
import { BaseDAO } from '../../../../core/common/dao/base.dao';

// entity
import { Category } from '../entities/category.entity';
import { ICategoryRepository } from '../interface/category.interface';

// decorator
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class CategoryRepository extends BaseDAO<Category> implements ICategoryRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Category);
    }

    public async findWithRelations(
        limit: number = 10,
        offset: number = 0
    ): Promise<[Category[], number]> {
        const query = this.repository.createQueryBuilder('category').skip(offset).take(limit);

        const [categories, total] = await query.getManyAndCount();
        return [categories, total];
    }
}
