import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceDto } from './invoice.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateInvoiceItemDto {

    @ApiProperty({description: 'Quantity of the item',example: 10,})
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({description: 'Unit price of the item',example: 19.99,})
    @IsNumber({ maxDecimalPlaces: 2 })
    @IsNotEmpty()
    unit_price: number;

    @ApiProperty({description: 'Description of the item', example: 'Premium subscription for one month'})
    @IsString()
    description: string;

}