import { ApiProperty } from "@nestjs/swagger";
import { CreateInvoiceItemDto } from "./create-invoice-item.dto";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";


export class CreateInvoiceItemsDto{

    @ApiProperty({type: [CreateInvoiceItemDto]})
    @ValidateNested({each: true})
    @Type(()=> CreateInvoiceItemDto)
    items: CreateInvoiceItemDto[];
}