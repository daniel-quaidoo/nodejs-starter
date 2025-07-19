import { PaymentProviderEnum } from '@lib/contracts/billing/enums/payment-provider.enum';
import { SubscriptionIntervalEnum } from '@lib/contracts/billing/enums/subscription-interval.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('subscription_plan')
export class SubscriptionPlan {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'enum', enum: PaymentProviderEnum , default: PaymentProviderEnum.CASH})
    provider: PaymentProviderEnum;

    @Column({type: 'enum', enum: SubscriptionIntervalEnum})
    interval: SubscriptionIntervalEnum;

    @Column('decimal', { precision: 10, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    invoice_limit : number;

    @Column({ nullable: true })
    description: string;
    
    @Column({ nullable: true })
    providerPlanCode: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @CreateDateColumn()
    updatedAt: Date;
}