import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType } from "../../payment/entities/payment-type.entity";

import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { TransactionType } from "./transaction-type.entity";
import { Invoice } from "../../invoice/entities/invoice.entity";
import { PaymentChannel } from "../../payment/entities/payment-channel.entity";
import { Refund } from "../../refunds/entities/refund.entity";
import { PaymentProviderEnum } from "@lib/contracts/billing/enums/payment-provider.enum";


@Entity('transaction')
export class Transaction {
    
    @PrimaryColumn()
    transaction_id: string;

    @Column({ type: 'enum', enum: PaymentProviderEnum , default: PaymentProviderEnum.CASH})
    provider: PaymentProviderEnum;

    @ManyToOne(() => PaymentType, { nullable : true, eager: true })
    payment_type: PaymentType;

    @ManyToOne(() => PaymentChannel, { nullable : true, eager: true })
    payment_channel: PaymentChannel;

    @Column()
    transaction_date: Date;

    @Column({ type: 'text', nullable: true })
    transaction_details: string;

    @ManyToOne(() => TransactionType)
    transaction_type: TransactionType;

    @ManyToOne(() => Invoice, (invoice) => invoice.transactions)
    invoice: Invoice;

    @OneToMany(() => Refund, (refund) => refund.transaction)
    refunds: Refund[];

    @Column('decimal', { precision: 10, scale: 2 })
    transaction_amount: number;

    @Column({ type: 'enum', enum: PaymentStatusEnum })
    transaction_status: PaymentStatusEnum;

    @Column({ type: 'varchar', nullable: true })
    provider_reference: string;   // replaces reference number

}
