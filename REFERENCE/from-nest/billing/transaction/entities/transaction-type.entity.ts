
//enum
import { TransactionTypeEnum } from "@lib/contracts/billing/enums/transaction-type.enum";

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('transaction_type')
export class TransactionType{
    @PrimaryGeneratedColumn()
    transaction_type_id: number;

    @Column({ type: 'enum', enum: TransactionTypeEnum })
    transaction_type_name: TransactionTypeEnum;

    @Column({ length: 128 })
    transaction_type_description: string;
}