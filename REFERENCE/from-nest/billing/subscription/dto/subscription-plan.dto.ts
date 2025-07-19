import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { User } from '../../../auth/users/entities/user.entity';
import { Type } from 'class-transformer';

export class SubscriptionDto {
    @ApiProperty({ example: 'b3f1c8e2-1234-4a56-9abc-1234567890ab' })
    @IsString()
    @IsOptional()
    id?: string;

    @ApiProperty({ example: 'user-id-123' })
    @Type(() => User)
    @IsString()
    user: User; 

    @ApiProperty({ example: 'plan-id-456' })
    @IsString()
    paystackPlanCode: string; 

    @ApiProperty({ example: 'ACTIVE', enum: SubscriptionStatusEnum })
    status: SubscriptionStatusEnum;

    @ApiPropertyOptional({ example: 'Access to all premium features', description: 'Description of the subscription plan' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '2024-06-01T12:00:00.000Z', required: false })
    @IsOptional()
    createdAt?: Date;

    @ApiProperty({ example: '2024-06-10T12:00:00.000Z', required: false })
    @IsOptional()
    updatedAt?: Date;
}