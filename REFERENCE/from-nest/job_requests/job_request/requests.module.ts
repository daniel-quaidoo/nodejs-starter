import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobRequest } from './entities/job-requests.entity';
import { Media } from '../../resources/entities/media.entity';
import { ResourcesModule } from '../../resources/resources.module';

@Module({
    imports: [TypeOrmModule.forFeature([JobRequest, Media]),
        ResourcesModule, 
    ],
    controllers: [
        RequestsController,],
    providers: [
        RequestsService,],
    exports: [
        RequestsService, TypeOrmModule.forFeature([JobRequest, Media])],
})
export class RequestsModule { }
