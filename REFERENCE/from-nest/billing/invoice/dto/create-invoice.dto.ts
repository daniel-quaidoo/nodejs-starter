//enums
import { InvoiceTypeEnum } from "@lib/contracts/billing/enums/invoice-type.enum";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";

import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsDate, IsEnum, IsISO8601, IsNumber, IsOptional, IsString } from "class-validator";
import { Type } from "class-transformer";

//dto
import { TransactionDto } from "../../transaction/dto/transaction.dto";
import { UserDto } from "../../../auth/users/dto/user.dto";
import { InvoiceItemDto } from "./invoice-item.dto";
import { string } from "joi";
import { InvoiceItem } from "../entities/invoice-item.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";


export class CreateInvoiceDto{

    @ApiProperty({description: 'User ID of Invoice Buyer', example: '47849da9-ebd1-4b02-9517-8717791fdd5c'})
    @IsString()
    issued_by: string;

    @ApiProperty({description: 'User ID of Invoice Payer', example: '47849da9-ebd1-4b02-9517-8717791fdd5c'})
    @IsString()
    issued_to: string;

    @ApiProperty({description: 'Invoice Details', example: 'First payment for services'})
    @IsString()
    invoice_details: string;

    @ApiProperty({description: 'Invoice Amount', example: 150.75})
    @IsNumber({ maxDecimalPlaces: 2 })
    invoice_amount: number;

    @ApiProperty({description: 'Invoice due date', example: '2023-12-31'})
    @Type(() => Date)
    @IsDate()
    due_date: Date;

    @ApiProperty({description: 'Invoice date paid', example: '2023-12-15'})
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date_paid: Date;

    @ApiProperty({description: 'Invoice type', example: 'general'})
    @IsEnum(InvoiceTypeEnum)
    invoice_type: InvoiceTypeEnum;

    @ApiProperty({description: 'Invoice Payment status', example: 'pending'})
    @IsEnum(PaymentStatusEnum)
    status: PaymentStatusEnum;

    @ApiProperty({description: 'Invoice items'})
    @IsArray()
    @IsOptional()
    item_ids?: string[];

    @ApiProperty({description: 'Invoice transactions'})
    @IsArray()
    @IsOptional()
    transaction_ids?:string[];
}

    