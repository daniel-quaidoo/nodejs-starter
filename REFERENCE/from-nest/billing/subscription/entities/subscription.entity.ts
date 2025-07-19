import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { SubscriptionPlan } from './subscription-plan.entity';
import { User } from '../../../auth/users/entities/user.entity';
import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { PaymentProviderEnum } from '@lib/contracts/billing/enums/payment-provider.enum';


@Entity('subscription')
export class Subscription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    user: User;

    @ManyToOne(() => SubscriptionPlan)
    plan: SubscriptionPlan;

    @Column({ type: 'enum', enum: PaymentProviderEnum , default: PaymentProviderEnum.CASH})
    provider: PaymentProviderEnum;

    @Column()
    providerSubscriptionCode: string;

    @Column({type: 'enum', enum: SubscriptionStatusEnum})
    status: SubscriptionStatusEnum;

    @Column()
    nextPaymentDate: Date;

    @Column({ nullable: true })
    authorizationCode: string;

    @CreateDateColumn()
    start_date: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date;
}