import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientConfigModule } from '@app/common/config';

// services
import { CountryService } from './country.service';

// controller
import { CountryController } from './country.controller';


// entity
import { Country } from './entities/country.entity';

@Module({
    imports: [
        ClientConfigModule,
        TypeOrmModule.forFeature([Country]),
    ],
    controllers: [CountryController],
    providers: [CountryService],
    exports: [CountryService],
})
export class CountryModule {}