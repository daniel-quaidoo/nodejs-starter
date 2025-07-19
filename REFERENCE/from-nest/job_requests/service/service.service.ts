import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from '@lib/contracts/job_requests/service/create-service.dto';
import { UpdateServiceDto } from '@lib/contracts/job_requests/service/update-service.dto';
import { Category } from '../category/entities/category.entity';
import { AssignServicesToCategoriesDto } from '@lib/contracts/job_requests/service/assign-services-to-categories.dto';
import { RemoveServiceFromCategoriesDto } from '@lib/contracts/job_requests/service/remove-services-from-categories.dto';


@Injectable()
export class ServiceService {
    constructor(
        @InjectRepository(Service)
        private readonly serviceRepo: Repository<Service>,

        @InjectRepository(Category)
        private readonly categoryRepo: Repository<Category>,
    ) {}

    async create(dto: CreateServiceDto): Promise<Service> {
        const service = this.serviceRepo.create(dto);
        return this.serviceRepo.save(service);
    }

    async findAll(): Promise<Service[]> {
        return this.serviceRepo.find();
    }

    async findOne(serviceId: string): Promise<Service> {
        const service = await this.serviceRepo.findOne({ where: { id:serviceId } });
        if (!service) throw new NotFoundException('Service not found');
        return service;
    }

    async update(serviceId: string, dto: UpdateServiceDto): Promise<Service> {
        const service = await this.findOne(serviceId);
        const updated = Object.assign(service, dto);
        return this.serviceRepo.save(updated);
    }

    async remove(serviceId: string): Promise<void> {
        const service = await this.findOne(serviceId);
        await this.serviceRepo.remove(service);
    }


    async assignServicesToCategories(dto: AssignServicesToCategoriesDto){
        const { serviceAliases, categoryAliases} = dto;

        const services = await this.serviceRepo.find({
            where: { alias: In(serviceAliases)},
            relations: ['categories'],
        })

        const categories = await this.categoryRepo.find({
            where: { alias: In(categoryAliases)},
            relations: ['services'],
        })

        if (services.length === 0 || categories.length === 0){
            throw new NotFoundException('No valid services or categories found');
        } 

        for( const service of services){
            const categoryIds = new Set(service.categories.map(c => c.id));

            for(const category of categories){
                if(!categoryIds.has(category.id)){
                    service.categories.push(category);
                }
            }
            await this.serviceRepo.save(service);
            
        }
        return { message: 'Services assigned to categories successfully' };
    }

    async removeServiceFromCategories(dto: RemoveServiceFromCategoriesDto): Promise<void> {
        const service = await this.serviceRepo.findOne({
            where: { alias: dto.serviceAlias },
            relations: ['categories'],
        });

        if (!service) {
            throw new NotFoundException('Service not found');
        }

        const categories = await this.categoryRepo.find({
            where: { alias: In(dto.categoryAliases) },
        });

        if (categories.length === 0) {
            throw new NotFoundException('No matching categories found');
        }

        // Filter out the categories to remove
        service.categories = service.categories.filter(
            (cat) => !dto.categoryAliases.includes(cat.alias),
        );

        await this.serviceRepo.save(service);
        }


}
