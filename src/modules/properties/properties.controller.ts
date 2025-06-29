// service
import { PropertyService } from './properties.service';

// entity
import { Property } from './entities/property.entity';
import { PropertyType } from './entities/property-type.entity';
import { UnitType } from './entities/unit-type.entity';
import { Amenity } from './entities/amenity.entity';
import { EntityAmenities } from './entities/entity-amenities.entity';
import { Media } from './entities/media.entity';

// dto
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyDto } from './dto/property.dto';
import { CreatePropertyTypeDto, PropertyTypeDto } from './dto/property-type.dto';
import { CreateUnitTypeDto, UnitTypeDto } from './dto/unit-type.dto';
import { CreateAmenityDto, AmenityDto } from './dto/amenity.dto';
import { CreateEntityAmenitiesDto, EntityAmenitiesDto } from './dto/entity-amenities.dto';
import { CreateMediaDto, MediaDto } from './dto/media.dto';

// decorator
import { Controller, Get, Post, Put, Delete } from '../../core/common/decorators/route.decorator';
import { Body, Param } from '../../core/common/decorators/param.decorator';

@Controller('/properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    // Property Type Endpoints
    @Post('/property-types')
    public async createPropertyType(@Body() dto: CreatePropertyTypeDto): Promise<PropertyTypeDto> {
        return this.propertyService.createPropertyType(dto);
    }

    @Get('/property-types')
    public async getPropertyTypes(): Promise<PropertyTypeDto[]> {
        return this.propertyService.getPropertyTypes();
    }

    // Unit Type Endpoints
    @Post('/unit-types')
    public async createUnitType(@Body() dto: CreateUnitTypeDto): Promise<UnitTypeDto> {
        return this.propertyService.createUnitType(dto);
    }

    @Get('/unit-types')
    public async getUnitTypes(): Promise<UnitTypeDto[]> {
        return this.propertyService.getUnitTypes();
    }

    // Property Endpoints
    @Post('/')
    public async createProperty(@Body() dto: CreatePropertyDto): Promise<PropertyDto> {
        return this.propertyService.createProperty(dto);
    }

    @Get('/')
    public async getProperties(): Promise<{
        success: boolean;
        error: string;
        data: PropertyDto[];
        meta: { total_items: number; limit: number; offset: number };
    }> {
        const [properties, total] = await this.propertyService.getProperties();
        return {
            success: true,
            error: '',
            data: properties,
            meta: {
                total_items: total,
                limit: 10,
                offset: 0,
            },
        };
    }

    @Get('/:id')
    public async getProperty(@Param('id') id: string): Promise<PropertyDto | null> {
        return this.propertyService.getProperty(id);
    }

    @Put('/:id')
    public async updateProperty(
        @Param('id') id: string,
        @Body() dto: CreatePropertyDto
    ): Promise<PropertyDto> {
        return this.propertyService.updateProperty(id, dto);
    }

    @Delete('/:id')
    public async deleteProperty(@Param('id') id: string): Promise<void> {
        await this.propertyService.deleteProperty(id);
    }

    // Amenity Endpoints
    @Post('/amenities')
    public async createAmenity(@Body() dto: CreateAmenityDto): Promise<AmenityDto> {
        return this.propertyService.createAmenity(dto);
    }

    @Get('/amenities')
    public async getAmenities(): Promise<AmenityDto[]> {
        return this.propertyService.getAmenities();
    }

    @Put('/amenities/:id')
    public async updateAmenity(
        @Param('id') id: string,
        @Body() dto: CreateAmenityDto
    ): Promise<AmenityDto> {
        return this.propertyService.updateAmenity(id, dto);
    }

    @Delete('/amenities/:id')
    public async deleteAmenity(@Param('id') id: string): Promise<void> {
        await this.propertyService.deleteAmenity(id);
    }

    // Entity Amenities Endpoints
    @Post('/entity-amenities')
    public async createEntityAmenities(
        @Body() dto: CreateEntityAmenitiesDto
    ): Promise<EntityAmenitiesDto> {
        return this.propertyService.createEntityAmenities(dto);
    }

    @Get('/entity-amenities')
    public async getEntityAmenities(): Promise<EntityAmenitiesDto[]> {
        return this.propertyService.getEntityAmenities();
    }

    @Delete('/entity-amenities/:id')
    public async deleteEntityAmenities(@Param('id') id: string): Promise<void> {
        await this.propertyService.deleteEntityAmenities(id);
    }

    // Media Endpoints
    @Post('/media')
    public async createMedia(@Body() dto: CreateMediaDto): Promise<MediaDto> {
        return this.propertyService.createMedia(dto);
    }

    @Get('/media')
    public async getMedia(): Promise<MediaDto[]> {
        return this.propertyService.getMedia();
    }

    @Get('/media/property/:id')
    public async getMediaByProperty(@Param('id') id: string): Promise<MediaDto[]> {
        return this.propertyService.getMediaByProperty(id);
    }

    @Put('/media/:id')
    public async updateMedia(
        @Param('id') id: string,
        @Body() dto: CreateMediaDto
    ): Promise<MediaDto> {
        return this.propertyService.updateMedia(id, dto);
    }

    @Delete('/media/:id')
    public async deleteMedia(@Param('id') id: string): Promise<void> {
        await this.propertyService.deleteMedia(id);
    }
}
