import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

// common
import { ClientConfigModule } from '../../../../../common/config';

// entity
import { Region } from '../region/entities/region.entity';

// controller
import { CityController } from './city.controller';

// service
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { Country } from '../country/entities/country.entity';

@Module({
    imports: [
        ClientConfigModule,
        TypeOrmModule.forFeature([City, Region, Country]),
    ],
    controllers: [CityController],
    providers: [CityService],
    exports: [CityService],
})
export class CityModule {}