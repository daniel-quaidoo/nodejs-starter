//enums
import { InvoiceTypeEnum } from "@lib/contracts/billing/enums/invoice-type.enum";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsDecimal, IsEnum, IsNumber, IsString } from "class-validator";
import { Type } from "class-transformer";

//dto
import { TransactionDto } from "../../transaction/dto/transaction.dto";
import { UserDto } from "../../../auth/users/dto/user.dto";
import { InvoiceItemDto } from "./invoice-item.dto";


export class InvoiceDto{

    @ApiProperty({description: 'Invoice ID', example: 'INV12345'})
    @IsString()
    invoice_id: string;

    @ApiProperty({description: 'User ID of Invoice Seller', example: '47849da9-ebd1-4b02-9517-8717791fdd5c'})
    @IsString()
    issued_by: string;

    @ApiProperty({description: 'User ID of Invoice Buyer', example: '47849da9-ebd1-4b02-9517-8717791fdd5c'})
    @IsString()
    issued_to: string;

    @ApiProperty({description: 'Invoice Details', example: 'Payment for subscription services'})
    @IsString()
    invoice_details: string;

    @ApiProperty({description: 'Invoice Amount', example: 150.75})
    @IsDecimal()
    invoice_amount: number;

    @ApiProperty({description: 'Invoice due date', example: '2023-12-31T23:59:59.000Z'})
    @IsDate()
    due_date: Date;

    @ApiProperty({description: 'Invoice date paid', example: '2023-12-15T14:30:00.000Z'})
    @IsDate()
    date_paid: Date;

    @ApiProperty({description: 'Invoice type', example: 'subscription'})
    @IsEnum(InvoiceTypeEnum)
    invoice_type: InvoiceTypeEnum;

    @ApiProperty({description: 'Invoice Payment status', example: 'paid'})
    @IsEnum(PaymentStatusEnum)
    status: PaymentStatusEnum;

    @ApiProperty({description: 'Invoice items', example: ''})
    @IsArray()
    item_ids?: string[];

    @ApiProperty({description: 'Invoice transactions', example: ''})
    @IsArray()
    transaction_ids?:string[];
}

