import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, IsDateString } from 'class-validator';
import { User } from '../../../auth/users/entities/user.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';



export class CreateSubscriptionDto {

    @ApiProperty({ description: 'User associated with the subscription', type: () => User, example: '63be6d57-64d9-4e90-b3ac-bcb90348f9a3' })
    @IsUUID()
    user_id: string;

    @ApiProperty({ description: 'Subscription plan selected by the user', type: () => SubscriptionPlan, example: '0e5224fb-16ae-48ff-9e21-51c28d791152'})
    @IsUUID()
    plan_id: string;

    @ApiProperty({ description: 'Authorization code for payment', required: false, example: 'AUTH_abcdef123456' })
    @IsString()
    @IsOptional()
    authorizationCode?: string;

    @ApiProperty({ type: 'string', format: 'date-time', required: false })
    @IsDateString()
    @IsOptional()
    start_date?: Date;
}