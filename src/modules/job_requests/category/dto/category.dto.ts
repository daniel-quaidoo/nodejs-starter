import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

// entity
import { Category } from '../entities/category.entity';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

export class CategoryDto extends BaseMapper<Category> {
    protected ContractClass: ClassConstructor<Category> = Category;

    @IsUUID()
    id: string;

    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsString()
    @IsNotEmpty()
    alias: string;

    @IsString()
    description: string;

    // services: Service[];
}
