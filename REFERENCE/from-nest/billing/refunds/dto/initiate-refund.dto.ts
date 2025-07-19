import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class InitiateRefundDto {

    @ApiProperty({ description: 'Transaction ID', format: 'varchar' })
    @IsString()
    transactionId: string;

    @ApiProperty({ description: 'Refund amount', example: 100.00 })
    @IsNumber()
    amount: number;

    @ApiPropertyOptional({ description: 'Reason for refund' })
    @IsOptional()
    @IsString()
    reason?: string;


}