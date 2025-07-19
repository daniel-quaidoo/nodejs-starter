// service
import { PropertyService } from './property.service';

// dto
import { PropertyDto } from './dto/property.dto';
import { PropertyTypeDto } from './dto/property-type.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { CreateUnitTypeDto, UnitTypeDto } from '../units/dto/unit-type.dto';

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
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    // Property Type Endpoints
    @Post('/property-types')
    public createPropertyType(@Body() dto: CreatePropertyTypeDto): Promise<PropertyTypeDto> {
        return this.propertyService.createPropertyType(dto);
    }

    @Get('/property-types')
    public getPropertyTypes(): Promise<PropertyTypeDto[]> {
        return this.propertyService.getPropertyTypes();
    }

    // Unit Type Endpoints
    @Post('/unit-types')
    public createUnitType(@Body() dto: CreateUnitTypeDto): Promise<UnitTypeDto> {
        return this.propertyService.createUnitType(dto);
    }

    @Get('/unit-types')
    public getUnitTypes(): Promise<UnitTypeDto[]> {
        return this.propertyService.getUnitTypes();
    }

    // Property Endpoints
    @Post('/')
    public createProperty(@Body() dto: CreatePropertyDto): Promise<PropertyDto> {
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
    public getProperty(@Param('id') id: string): Promise<PropertyDto | null> {
        return this.propertyService.getProperty(id);
    }

    @Put('/:id')
    public updateProperty(
        @Param('id') id: string,
        @Body() dto: CreatePropertyDto
    ): Promise<PropertyDto> {
        return this.propertyService.updateProperty(id, dto);
    }

    @Delete('/:id')
    public async deleteProperty(@Param('id') id: string): Promise<void> {
        await this.propertyService.deleteProperty(id);
    }
}
