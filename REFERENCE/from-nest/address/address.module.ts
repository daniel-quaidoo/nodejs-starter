import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//entity
import { City } from './city/entities/city.entity';
import { Address } from './entities/address.entity';
import { Region } from './region/entities/region.entity';
import { Country } from './country/entities/country.entity';

// service
import { AddressService } from './address.service';

// controller
import { AddressController } from './address.controller';

// module
import { CityModule } from './city/city.module';
import { RegionModule } from './region/region.module';
@Module({
  imports:[
    TypeOrmModule.forFeature([Address, City, Region, Country]),
    RegionModule,
    CityModule,
  ],
  controllers: [AddressController],
  providers: [AddressService]
})
export class AddressModule {}
