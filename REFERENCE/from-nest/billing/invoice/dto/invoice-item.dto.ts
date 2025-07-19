import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { InvoiceDto } from './invoice.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class InvoiceItemDto {

    @ApiProperty({description: 'ID for  invoice item',example: '123e4567-e89b-12d3-a456-426614174000',})
    @IsUUID()
    @IsOptional()
    invoice_item_id: string;

    @ApiProperty({description: 'ID for invoice',example: '123e4567-e89b-12d3-a456-426614174001',})
    @Type(() => InvoiceDto)
    @IsNotEmpty()
    invoice: InvoiceDto;

    @ApiProperty({description: 'Quantity of the item',example: 10,})
    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @ApiProperty({description: 'Unit price of the item',example: 19.99,})
    @IsDecimal()
    @IsNotEmpty()
    unit_price: number;

    @ApiProperty({description: 'Total price for the item (quantity * unit price)',example: 199.90})
    @IsDecimal()
    @IsNotEmpty()
    total_price?: number;

    @ApiProperty({description: 'Description of the item', example: 'Premium subscription for one month'})
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({description: 'Reference identifier for the item',example: 'REF123456'})
    @IsString()
    @IsNotEmpty()
    provider_reference: string;
}