import { IsString, IsOptional } from 'class-validator';
import { ClassConstructor } from 'class-transformer';

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// entity
import { PropertyType } from '../entities/property-type.entity';

export class CreatePropertyTypeDto {
    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class PropertyTypeDto extends BaseMapper<CreatePropertyTypeDto> {
    protected ContractClass: ClassConstructor<CreatePropertyTypeDto> = CreatePropertyTypeDto;

    id: string;
    name: string;
    description: string | undefined;
    createdAt: Date;
    updatedAt: Date;

    public static toContract(propertyType: PropertyType): PropertyTypeDto {
        const dto = new PropertyTypeDto();
        dto.id = propertyType.propertyTypeId.toString();
        dto.name = propertyType.name;
        dto.description = propertyType.description || undefined;
        dto.createdAt = propertyType.createdAt;
        dto.updatedAt = propertyType.updatedAt;
        return dto;
    }
}
