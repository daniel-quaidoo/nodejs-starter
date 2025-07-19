import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ApiTags } from '@nestjs/swagger';
import { AssignServicesToCategoriesDto } from './dto/assign-services-to-categories.dto';
import { RemoveServiceFromCategoriesDto } from './dto/remove-services-from-categories.dto';

@ApiTags('Service')
@Controller('job-request/service')
export class ServiceController {
    constructor(private readonly serviceService: ServiceService) {}

    @Post()
    create(@Body() dto: CreateServiceDto) {
        return this.serviceService.create(dto);
    }

    @Get()
    findAll() {
        return this.serviceService.findAll();
    }

    @Get(':serviceId')
    findOne(@Param('serviceId') serviceId: string) {
        return this.serviceService.findOne(serviceId);
    }

    @Patch(':serviceId')
    update(@Param('serviceId') serviceId: string, @Body() dto: UpdateServiceDto) {
        return this.serviceService.update(serviceId, dto);
    }

    @Delete(':serviceId')
    remove(@Param('serviceId') serviceId: string) {
        return this.serviceService.remove(serviceId);
    }

    @Patch('assign-categories')
    async assignServicesToCategories(
        @Body() dto: AssignServicesToCategoriesDto
    ){
        return this.serviceService.assignServicesToCategories(dto);
    }
   
    @Delete('remove-categories')
    async removeServiceFromCategories(
        @Body() dto: RemoveServiceFromCategoriesDto
    ) {
        return this.serviceService.removeServiceFromCategories(dto);
    }

}
