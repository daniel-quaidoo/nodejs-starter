import { BillableTypeEnum } from '@lib/contracts/billing/enums/billable-type.enum';
import { EntityTypeEnum } from '@lib/contracts/billing/enums/entity-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEnum, IsBoolean, IsOptional, IsNumber } from 'class-validator';


export class CreateEntityBillableDto {
    @ApiProperty({ description: 'Entity ID (e.g. user_id, contract_id)' })
    @IsUUID()
    entity_id: string;

    @ApiProperty({ enum: EntityTypeEnum })
    @IsEnum(EntityTypeEnum)
    entity_type: EntityTypeEnum;

    @ApiProperty({ description: 'ID of the billable item (e.g. invoice_id)' })
    @IsUUID()
    billable_id: string;

    @ApiProperty({ enum: BillableTypeEnum })
    @IsEnum(BillableTypeEnum)
    billable_type: BillableTypeEnum;

    @ApiProperty({ required: false })
    @IsOptional()
    start_period?: Date;

    @ApiProperty({ required: false })
    @IsOptional()
    end_period?: Date;
}
