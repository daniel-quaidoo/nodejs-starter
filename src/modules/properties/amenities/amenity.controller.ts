// service
import { AmenityService } from './amenity.service';

// dto
import { CreateAmenityDto, AmenityDto } from './dto/amenity.dto';
import { CreateEntityAmenitiesDto, EntityAmenitiesDto } from './dto/entity-amenities.dto';

// decorator
import { Body, Param } from '../../../core/common/decorators/param.decorator';
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
} from '../../../core/common/decorators/route.decorator';

@Controller('/properties')
export class AmenityController {
    constructor(private readonly amenityService: AmenityService) {}

    // Amenity Endpoints
    @Post('/amenities')
    public createAmenity(@Body() dto: CreateAmenityDto): Promise<AmenityDto> {
        return this.amenityService.createAmenity(dto);
    }

    @Get('/amenities')
    public getAmenities(): Promise<AmenityDto[]> {
        return this.amenityService.getAmenities();
    }

    @Put('/amenities/:id')
    public updateAmenity(
        @Param('id') id: string,
        @Body() dto: CreateAmenityDto
    ): Promise<AmenityDto> {
        return this.amenityService.updateAmenity(id, dto);
    }

    @Delete('/amenities/:id')
    public async deleteAmenity(@Param('id') id: string): Promise<void> {
        await this.amenityService.deleteAmenity(id);
    }

    // Entity Amenities Endpoints
    @Post('/entity-amenities')
    public createEntityAmenities(
        @Body() dto: CreateEntityAmenitiesDto
    ): Promise<EntityAmenitiesDto> {
        return this.amenityService.createEntityAmenities(dto);
    }

    @Get('/entity-amenities')
    public getEntityAmenities(): Promise<EntityAmenitiesDto[]> {
        return this.amenityService.getEntityAmenities();
    }

    @Delete('/entity-amenities/:id')
    public async deleteEntityAmenities(@Param('id') id: string): Promise<void> {
        await this.amenityService.deleteEntityAmenities(id);
    }
}
