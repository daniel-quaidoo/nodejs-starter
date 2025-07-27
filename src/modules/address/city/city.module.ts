import { Module } from '../../../core/common/di/module.decorator';
import { CityController } from './controller/city.controller';
import { CityService } from './service/city.service';
import { CityRepository } from './repository/city.repository';
import { RegionService } from '../region/service/region.service';
import { RegionRepository } from '../region/repository/region.repository';
import { CountryService } from '../country/service/country.service';
import { CountryRepository } from '../country/repository/country.repository';

@Module({
    controllers: [CityController],
    services: [
        CityService,
        CityRepository,
        RegionService,
        RegionRepository,
        CountryService,
        CountryRepository,
    ],
    exports: [CityService, CityRepository],
})
export class CityModule {}
