import { Controller, Get , Post, Patch, Delete, Param, Body} from '@nestjs/common';

//services
import { CountryService } from './country.service';

// gateway dto
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CreateCountryDto as ClientCreateCountryDto } from '@lib/contracts/address/country/create-country.dto';
import { UpdateCountryDto as ClientUpdateCountryDto } from '@lib/contracts/address/country/update-country.dto';


@Controller('country')
export class CountryController {
    constructor(private readonly countryService: CountryService) {}
        
    @Post()
    create(@Body() dto: CreateCountryDto){
        return this.countryService.create(dto);
    }

    @Get()
    findAll(){
        return this.countryService.findAll()
    }

    @Get(':countryId')
    findOne(@Param ('countryId') countryId: string){
        return this.countryService.findOne(countryId)
    }

    @Patch(':countryId')
    update(@Param ('countryId') countryId: string, @Body() dto: UpdateCountryDto){
        return this.countryService.update(countryId, dto as ClientUpdateCountryDto)
    }

    @Delete(':countryId')
    delete(@Param('countryId') countryId:string){
        return this.countryService.delete(countryId)
    }
}