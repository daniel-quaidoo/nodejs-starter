// Unused imports removed for cleaner code

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// entity
import { Property } from '../entities/property.entity';

// dto
import { CreatePropertyDto } from './create-property.dto';

import { ClassConstructor } from 'class-transformer';

export class PropertyDto extends BaseMapper<CreatePropertyDto> {
    protected ContractClass: ClassConstructor<CreatePropertyDto> = CreatePropertyDto;

    propertyUnitAssocId: string;
    name: string;
    propertyType: string;
    numUnits: number;
    numBathrooms: number;
    numGarages: number;
    hasBalconies: boolean;
    hasParkingSpace: boolean;
    petsAllowed: boolean;
    description: string | undefined;
    amount: number;
    securityDeposit: number;
    commission: number;
    floorSpace: number;
    createdAt: Date;
    updatedAt: Date;

    public static toContract(property: Property): PropertyDto {
        const dto = new PropertyDto();
        dto.propertyUnitAssocId = property.propertyUnitAssocId;
        dto.name = property.name;
        dto.propertyType = property.propertyType;
        dto.numUnits = property.numUnits;
        dto.numBathrooms = property.numBathrooms;
        dto.numGarages = property.numGarages;
        dto.hasBalconies = property.hasBalconies;
        dto.hasParkingSpace = property.hasParkingSpace;
        dto.petsAllowed = property.petsAllowed;
        dto.description = property.description || undefined;
        dto.amount = property.amount;
        dto.securityDeposit = property.securityDeposit;
        dto.commission = property.commission;
        dto.floorSpace = property.floorSpace;
        dto.createdAt = property.createdAt;
        dto.updatedAt = property.updatedAt;
        return dto;
    }
}
