// service
import { BaseService } from '../../../core/common';

// entities
import { Category } from './entities/category.entity';

// decorator
import { Service } from '../../../core/common/di/component.decorator';

// repository
import { CategoryRepository } from './repository/category.repository';

@Service()
export class CategoryService extends BaseService<Category> {
    constructor(private readonly categoryRepository: CategoryRepository) {
        super(categoryRepository);
    }
}
