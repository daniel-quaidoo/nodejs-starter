import { Module } from '../../../core/common/di/module.decorator';
import { CountryController } from './controller/country.controller';
import { CountryService } from './service/country.service';
import { CountryRepository } from './repository/country.repository';

@Module({
    controllers: [CountryController],
    services: [CountryService, CountryRepository],
    exports: [CountryService, CountryRepository],
})
export class CountryModule {}
