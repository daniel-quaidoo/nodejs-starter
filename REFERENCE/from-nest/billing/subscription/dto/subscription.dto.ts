import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { User } from '../../../auth/users/entities/user.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';


export class SubscriptionDto {

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsUUID()
    @IsOptional()
    id: string;

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsNotEmpty()
    user_id: string;

    @ApiProperty({ type: 'string', format: 'uuid' })
    @IsNotEmpty()
    plan_id: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    providerSubscriptionCode: string;

    @ApiProperty({ enum: SubscriptionStatusEnum })
    @IsEnum(SubscriptionStatusEnum)
    status: SubscriptionStatusEnum;

    @ApiProperty({ type: 'string', format: 'date-time' })
    @IsDateString()
    nextPaymentDate: Date;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ApiProperty({ type: 'string', format: 'date-time', required: false })
    @IsDateString()
    @IsOptional()
    start_date?: Date;

    @ApiProperty({ type: 'string', format: 'date-time', required: false })
    @IsDateString()
    @IsOptional()
    updatedAt?: Date;
}