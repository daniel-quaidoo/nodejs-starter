import { InvoiceTypeEnum } from "@lib/contracts/billing/enums/invoice-type.enum";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import { InvoiceItem } from "./invoice-item.entity";
import { User } from "../../../auth/users/entities/user.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";
import { PaymentProviderEnum } from "@lib/contracts/billing/enums/payment-provider.enum";


@Entity('invoice')
export class Invoice{

    @PrimaryColumn({ type: 'varchar', unique: true })
    invoice_id: string;

    @ManyToOne(() => User, { eager: true })
    issued_by: User;
  
    @ManyToOne(() => User, { eager: true })
    issued_to: User;

    @Column({ type: 'enum', enum: PaymentProviderEnum , default: PaymentProviderEnum.CASH })
    provider: PaymentProviderEnum;

    @Column()
    invoice_details: string;

    @Column('decimal', { precision: 10, scale: 2 } )
    invoice_amount: number;

    @Column({nullable: true})
    due_date:Date;

    @Column({nullable: true})
    date_paid:Date;

    @Column({ type: 'enum', enum: InvoiceTypeEnum })
    invoice_type: InvoiceTypeEnum;

    @Column({ type: 'enum', enum: PaymentStatusEnum, default: PaymentStatusEnum.Pending })
    status: PaymentStatusEnum;

    @OneToMany(() => InvoiceItem, (item) => item.invoice, {cascade:true})
    items : InvoiceItem[]

    @OneToMany(() => Transaction, (transaction) => transaction.invoice)
    transactions : Transaction[]

}