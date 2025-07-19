
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from '@lib/contracts/job_requests/category/create-category.dto';
import { UpdateCategoryDto } from '@lib/contracts/job_requests/category/update-category.dto';


@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

        async create(dto: CreateCategoryDto): Promise<Category> {
            const category = this.categoryRepo.create(dto);
            return await this.categoryRepo.save(category);
        }

        async findAll(): Promise<Category[]> {
            return await this.categoryRepo.find();
        }

        async findOne(categoryId: string): Promise<Category> {
            const category = await this.categoryRepo.findOne({ where: { id: categoryId } });
            if (!category) throw new NotFoundException('Category not found');
            return category;
        }

        async update(categoryId: string, dto: UpdateCategoryDto): Promise<Category> {
            const category = await this.findOne(categoryId);
            Object.assign(category, dto);
            return await this.categoryRepo.save(category);
        }

        async remove(categoryId: string): Promise<void> {
            const result = await this.categoryRepo.delete(categoryId);
            if (result.affected === 0) {
            throw new NotFoundException('Category not found');
            }
        }
}
