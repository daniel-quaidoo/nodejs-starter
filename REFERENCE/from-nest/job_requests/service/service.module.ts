
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { CategoryModule } from '../category/category.module';
import { Category } from '../category/entities/category.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Service, Category]), CategoryModule],
  controllers: [ServiceController],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule {}
