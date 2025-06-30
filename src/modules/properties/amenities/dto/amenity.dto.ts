import { ClassConstructor } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

// entity
import { Amenity } from '../entities/amenity.entity';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

export class CreateAmenityDto {
    @IsString()
    amenityName: string;

    @IsString()
    amenityShortName: string;

    @IsString()
    @IsOptional()
    description: string | null;
}

export class AmenityDto extends BaseMapper<CreateAmenityDto> {
    protected ContractClass: ClassConstructor<CreateAmenityDto> = CreateAmenityDto;

    amenityId: string;
    amenityName: string;
    amenityShortName: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;

    public static toContract(amenity: Amenity): AmenityDto {
        const dto = new AmenityDto();
        dto.amenityId = amenity.amenityId;
        dto.amenityName = amenity.amenityName;
        dto.amenityShortName = amenity.amenityShortName;
        dto.description = amenity.description || null;
        dto.createdAt = amenity.createdAt;
        dto.updatedAt = amenity.updatedAt;
        return dto;
    }
}
