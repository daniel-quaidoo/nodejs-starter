import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";

// services
import { CityService } from "./city.service";

// gateway dto
import { CreateCityDto } from "./dto/create-city.dto";
import { UpdateCityDto } from "./dto/update-city.dto";


@Controller('city')
export class CityController{

    constructor(private readonly cityService: CityService) {}

    @Post()
    create(@Body() dto: CreateCityDto){
        return this.cityService.create(dto);
    }
    
    @Get()
    findAll(){
        return this.cityService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string){
        return this.cityService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string , @Body() dto: UpdateCityDto){
        return this.cityService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id') id: string){
        return this.cityService.remove(id);
    }
}