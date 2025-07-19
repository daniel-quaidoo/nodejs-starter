import { Module } from '@nestjs/common';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';
import { ClientConfigModule } from '@app/common/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouterModule } from '@nestjs/core';
import { appendSubPathsToBaseModule } from '@app/common/utils/helpers';

// entity
import { Region } from './entities/region.entity';
import { Country } from '../country/entities/country.entity';

@Module({
    imports: [
        ClientConfigModule,
        TypeOrmModule.forFeature([Region, Country]),
    ],
    controllers: [RegionController],
    providers: [RegionService],
    exports: [RegionService],
})
export class RegionModule {}