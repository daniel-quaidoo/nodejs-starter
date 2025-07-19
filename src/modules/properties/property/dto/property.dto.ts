import { ClassConstructor } from 'class-transformer';

// dto
import { CreatePropertyDto } from './create-property.dto';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

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
}
