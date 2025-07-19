import { SubscriptionIntervalEnum } from '@lib/contracts/billing/enums/subscription-interval.enum';
import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubscriptionPlanDto {
    @ApiProperty({ example: 'Pro Plan', description: 'Name of the subscription plan' })
    @IsString()
    name: string;

    @ApiProperty({ example: SubscriptionIntervalEnum.Monthly, enum: SubscriptionIntervalEnum, description: 'Interval for the subscription plan' })
    @IsEnum(SubscriptionIntervalEnum)
    interval: SubscriptionIntervalEnum;

    @ApiProperty({ example: 10.00, description: 'Amount to be charged for the plan (in smallest currency unit, e.g., kobo or cents)' })
    @IsNumber()
    amount: number;

    @ApiPropertyOptional({ example: 'Access to all premium features', description: 'Description of the subscription plan' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ example: 10, description: 'Maximum number of invoices allowed per period' })
    @IsOptional()
    @IsNumber()
    invoice_limit?: number;

}