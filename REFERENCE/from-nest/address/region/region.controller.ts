import { Controller, Get , Post, Patch, Delete, Param, Body} from '@nestjs/common';

//services
import { RegionService } from './region.service';

// gateway dto
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';


@Controller('region')
export class RegionController {
    constructor(private readonly regionService: RegionService) {}
        
    @Post()
    createRegion(@Body() dto: CreateRegionDto){
        return this.regionService.createRegion(dto)
    }

    @Get()
    getAllRegions(){
        return this.regionService.findAll()
    }

    @Get(':regionId')
    findOneRegion(@Param ('regionId') regionId: string){
        return this.regionService.findOne(regionId)
    }

    @Patch(':regionId')
    updateRegion(@Param ('regionId') regionId: string, @Body() dto: UpdateRegionDto){
        return this.regionService.update(regionId, dto)
    }

    @Delete(':regionId')
    deleteRegion(@Param('regionId') regionId:string){
        return this.regionService.delete(regionId)
    }
}