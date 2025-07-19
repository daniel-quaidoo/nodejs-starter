import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TransactionTypeEnum } from '@lib/contracts/billing/enums/transaction-type.enum';

export class CreateTransactionTypeDto {

    @ApiProperty({description: 'The type of transaction (e.g., debit, credit, refund)',enum: TransactionTypeEnum,example: TransactionTypeEnum.Debit,})
    @IsEnum(TransactionTypeEnum)
    @IsNotEmpty()
    transaction_type_name: TransactionTypeEnum;

    @ApiProperty({description: 'A brief explanation of what this transaction type represents',example: 'A debit transaction reduces the account balance.', })
    @IsString()
    @IsNotEmpty()
    transaction_type_description: string;
}
