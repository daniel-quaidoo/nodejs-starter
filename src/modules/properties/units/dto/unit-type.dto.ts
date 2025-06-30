import { IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// entity
import { UnitType } from '../entities/unit-type.entity';

export class CreateUnitTypeDto {
    @IsString()
    unitTypeName: string;
}

import { ClassConstructor } from 'class-transformer';

export class UnitTypeDto extends BaseMapper<CreateUnitTypeDto> {
    protected ContractClass: ClassConstructor<CreateUnitTypeDto> = CreateUnitTypeDto;

    id: string;
    unitTypeName: string;
    createdAt: Date;
    updatedAt: Date;

    public static toContract(unitType: UnitType): UnitTypeDto {
        const dto = new UnitTypeDto();
        dto.id = unitType.unitTypeId.toString();
        dto.unitTypeName = unitType.unitTypeName;
        dto.createdAt = unitType.createdAt;
        dto.updatedAt = unitType.updatedAt;
        return dto;
    }
}
