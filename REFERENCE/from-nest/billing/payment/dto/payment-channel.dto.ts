import {  IsString, IsNumber } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentChannelDto {

    @ApiProperty({description: 'The unique identifier for the payment type',example: 1})
    @IsNumber()
    payment_channel_id: number;

    @ApiProperty({description: 'The name of the payment channel',example: 'MTN'})
    @IsString()
    payment_channel_name: string;

    @ApiPropertyOptional({description: 'A brief description of the payment channel',example: 'Payment through MTN Mobile Money',})
    @IsString()
    payment_channel_description: string;

}