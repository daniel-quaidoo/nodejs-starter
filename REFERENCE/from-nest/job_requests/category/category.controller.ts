
import { Controller, Get, Post, Body, Param, Put, Delete,} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('job-request/category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    findAll() {
        return this.categoryService.findAll();
    }

    @Get(':categoryId')
    findOne(@Param('categoryId') categoryId: string) {
        return this.categoryService.findOne(categoryId);
    }

    @Put(':categoryId')
    update(@Param('categoryId') categoryId: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(categoryId, dto);
    }

    @Delete(':categoryId')
    remove(@Param('categoryId') categoryId: string) {
        return this.categoryService.remove(categoryId);
    }
}
