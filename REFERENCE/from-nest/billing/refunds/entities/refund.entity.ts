import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Transaction } from "../../transaction/entities/transaction.entity";
import { PayStackRefundStatusEnum } from "@lib/contracts/billing/enums/paystack-refund-status.enum";



@Entity('refunds')
export class Refund{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Transaction, (transaction) => transaction.refunds, { eager: true })
    transaction: Transaction;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    refund_reference: string;

    @Column({ nullable :true})
    reason: string;

    @Column({ type: 'enum', enum: PayStackRefundStatusEnum })
    status: PayStackRefundStatusEnum;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}