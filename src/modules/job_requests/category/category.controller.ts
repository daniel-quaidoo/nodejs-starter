// service
import { CategoryService } from './category.service';

// dto
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

// decorator
import { Body, Param } from '../../../core/common/decorators/param.decorator';
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
} from '../../../core/common/decorators/route.decorator';

@Controller('/job-requests')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post('/categories')
    public createCategory(@Body() dto: CreateCategoryDto): Promise<CategoryDto> {
        return this.categoryService.create(dto).then(category => CategoryDto.toContract(category));
    }

    @Get('/categories')
    public getCategories(): Promise<CategoryDto[]> {
        return this.categoryService
            .findAll()
            .then(categories => categories.map(category => CategoryDto.toContract(category)));
    }

    @Put('/categories/:id')
    public updateCategory(
        @Param('id') id: string,
        @Body() dto: UpdateCategoryDto
    ): Promise<CategoryDto | null> {
        return this.categoryService
            .update(id, dto)
            .then(category => CategoryDto.toContract(category));
    }

    @Delete('/categories/:id')
    public async deleteCategory(@Param('id') id: string): Promise<void> {
        await this.categoryService.delete(id);
    }
}
