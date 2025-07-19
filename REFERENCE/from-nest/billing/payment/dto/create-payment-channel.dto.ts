import { IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';
// import { PaymentchannelEnum } from '@lib/contracts/billing/enums/payment-type.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePaymentChannelDto {

    @ApiProperty({description: 'The name of the payment channel',example: 'MTN '})
    @IsString()
    payment_channel_name: string;

    @ApiPropertyOptional({description: 'A brief description of the payment channel',example: 'Payment through MTN Mobile Money',})
    @IsString()
    payment_channel_description: string;

}