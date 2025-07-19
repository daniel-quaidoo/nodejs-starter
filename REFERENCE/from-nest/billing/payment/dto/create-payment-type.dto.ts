import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
// import { PaymentTypeEnum } from '@lib/contracts/billing/enums/payment-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentTypeDto {

    @ApiProperty({description: 'The name of the payment type',example: 'CREDIT_CARD'})
    @IsString()
    payment_type_name: string;

    @ApiPropertyOptional({description: 'A brief description of the payment type',example: 'Payment made using a credit card',})
    @IsString()
    payment_type_description: string;

    @ApiPropertyOptional({description: 'The number of partitions for the payment',example: 3})
    @IsNumber()
    payment_partitions: number;
}