import { IsString, IsUUID } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// entity
import { EntityAmenities } from '../entities/entity-amenities.entity';

export class CreateEntityAmenitiesDto {
    @IsUUID()
    entityId: string;

    @IsString()
    entityType: string;

    @IsUUID()
    amenityId: string;
}

export class EntityAmenitiesDto extends BaseMapper<CreateEntityAmenitiesDto> {
    protected ContractClass = CreateEntityAmenitiesDto;

    id: string;
    entityId: string;
    entityType: string;
    amenityId: string;

    public static toContract(entityAmenities: EntityAmenities): EntityAmenitiesDto {
        const dto = new EntityAmenitiesDto();
        dto.id = entityAmenities.entityAmenitiesId.toString();
        dto.entityId = entityAmenities.entityId;
        dto.entityType = entityAmenities.entityType;
        dto.amenityId = entityAmenities.amenityId;
        return dto;
    }
}
