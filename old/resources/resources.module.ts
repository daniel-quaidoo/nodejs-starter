import { Module } from '@nestjs/common';
import { ResourcesController } from './resources.controller';
import { ResourcesService } from './resources.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [ResourcesService, TypeOrmModule.forFeature([Media])],
})
export class ResourcesModule {}
