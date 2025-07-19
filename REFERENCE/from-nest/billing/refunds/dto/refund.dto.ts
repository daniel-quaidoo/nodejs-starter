import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';
import { PayStackRefundStatusEnum } from '@lib/contracts/billing/enums/paystack-refund-status.enum';

export class RefundDto {
    
  @ApiProperty({ description: 'Refund ID', format: 'uuid' })
  @IsUUID()
  id: string;

  @ApiProperty({ description: 'Transaction ID', format: 'varchar' })
  @IsString()
  transactionId: string;

  @ApiProperty({ description: 'Refund amount', example: 100.00 })
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ description: 'Refund reference' })
  @IsOptional()
  @IsString()
  refund_reference?: string;

  @ApiPropertyOptional({ description: 'Reason for refund' })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiProperty({ description: 'Refund status', enum: PayStackRefundStatusEnum })
  @IsEnum(PayStackRefundStatusEnum)
  status: PayStackRefundStatusEnum;

  @ApiProperty({ description: 'Created at', type: String, format: 'date-time' })
  created_at: Date;

  @ApiProperty({ description: 'Updated at', type: String, format: 'date-time' })
  updated_at: Date;
}