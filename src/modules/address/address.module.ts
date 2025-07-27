import { Module } from '../../core/common/di/module.decorator';
import { AddressController } from './controller/address.controller';
import { AddressService } from './service/address.service';
import { AddressRepository } from './repository/address.repository';
import { CityService } from './city/service/city.service';
import { CityRepository } from './city/repository/city.repository';
import { RegionService } from './region/service/region.service';
import { RegionRepository } from './region/repository/region.repository';
import { CountryService } from './country/service/country.service';
import { CountryRepository } from './country/repository/country.repository';

@Module({
    controllers: [AddressController],
    services: [
        AddressService,
        AddressRepository,
        CityService,
        CityRepository,
        RegionService,
        RegionRepository,
        CountryService,
        CountryRepository,
    ],
    exports: [AddressService, AddressRepository],
})
export class AddressModule {}
