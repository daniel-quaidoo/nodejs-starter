import { Module } from '../../../core/common/di/module.decorator';
import { RegionController } from './controller/region.controller';
import { RegionService } from './service/region.service';
import { RegionRepository } from './repository/region.repository';
import { CountryService } from '../country/service/country.service';
import { CountryRepository } from '../country/repository/country.repository';

@Module({
    controllers: [RegionController],
    services: [RegionService, RegionRepository, CountryService, CountryRepository],
    exports: [RegionService, RegionRepository],
})
export class RegionModule {}
