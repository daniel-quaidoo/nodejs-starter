

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from '../entities/subscription.entity';
import { Repository } from 'typeorm';
import { User } from '../../../auth/users/entities/user.entity';
import { Invoice } from '../../invoice/entities/invoice.entity';
import { InvoiceItem } from '../../invoice/entities/invoice-item.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { TransactionType } from '../../transaction/entities/transaction-type.entity';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { generateInvoiceId } from '../../utils/invoice-id.utils';
import { InvoiceTypeEnum } from '@lib/contracts/billing/enums/invoice-type.enum';
import { PaymentStatusEnum } from '@lib/contracts/billing/enums/payment-status.enum';
import { generateTransactionId } from '../../utils/transaction-id.utils';
import { TransactionTypeEnum } from '@lib/contracts/billing/enums/transaction-type.enum';
import { PaymentTypeService } from '../../payment/services/payment-type.service';
import { PaymentChannelService } from '../../payment/services/payment-channel.service';
import { EntityBillableService } from '../../entity-billable/entity-billable.service';
import { PaymentProviderEnum } from '@lib/contracts/billing/enums/payment-provider.enum';

@Injectable()
export class SubscriptionSetupService {

    private readonly logger = new Logger(SubscriptionSetupService.name);
    constructor(
        @InjectRepository(Subscription) private subscriptionRepo: Repository<Subscription>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
        @InjectRepository(InvoiceItem) private invoiceItemRepo: Repository<InvoiceItem>,
        @InjectRepository(Transaction) private transactionRepo: Repository<Transaction>,
        @InjectRepository(TransactionType) private transactionTypeRepo: Repository<TransactionType>,
        private readonly paymentTypeService: PaymentTypeService,
        private readonly paymentChannelService: PaymentChannelService,
        private readonly entityBillableService: EntityBillableService,
    ) {}

    
    async handleSubscriptionActivation(user: User, plan: SubscriptionPlan, data: any) {
        this.logger.log(`Handling subscription activation for user: ${user.user_id}, plan: ${plan.id}`);
        const subscription = await this.subscriptionRepo.findOne({
             where: { user: { user_id: user.user_id }, plan: { id: plan.id }, status: SubscriptionStatusEnum.Pending },
        });

        if (!subscription) throw new Error('Subscription not found');
        console.log('Subscription found:', subscription.id);
        console.log('response data:', data);

        this.logger.log(`Updating subscription details for subscription ID: ${subscription.id}`);

        // Update subscription
        subscription.providerSubscriptionCode = data.subscription_code;
        subscription.authorizationCode = data.authorization?.authorization_code;
        subscription.nextPaymentDate = new Date(data.next_payment_date);
        subscription.start_date = new Date(data.createdAt);
        subscription.status = SubscriptionStatusEnum.Active;

        await this.subscriptionRepo.save(subscription);

        this.logger.log(`Subscription updated successfully for subscription ID: ${subscription.id}`);
        // System user
        const systemUser = await this.userRepo.findOneBy({ email: 'testuser1@abc.com' });
        if (!systemUser) throw new Error('System user not found');

        this.logger.log(`System user found: ${systemUser.user_id}`);

        // console.log(subscription)
        // Invoice
       
        const invoice = this.invoiceRepo.create({
            invoice_id: generateInvoiceId(),
            issued_by: systemUser,
            issued_to: user,
            invoice_details: `Subscription billing for ${plan.name}`,
            invoice_amount: +plan.amount,
            date_paid: data.createdAt,
            due_date: subscription.nextPaymentDate,
            invoice_type: InvoiceTypeEnum.Subscription,
            status: PaymentStatusEnum.Paid,
            provider: PaymentProviderEnum.PAYSTACK,
        });
        const savedInvoice = await this.invoiceRepo.save(invoice);

        await this.entityBillableService.syncFromInvoice(savedInvoice);
        
        this.logger.log(`Invoice created successfully with ID: ${savedInvoice.invoice_id}`);

        // Invoice item
        const item = this.invoiceItemRepo.create({
            invoice: savedInvoice,
            quantity: 1,
            unit_price: +plan.amount,
            total_price: +plan.amount,
            description: `Subscription billing for ${plan.name}`,
            provider_reference: subscription.id,
        });
        await this.invoiceItemRepo.save(item);
        this.logger.log(`Invoice item created successfully for invoice ID: ${savedInvoice.invoice_id}`);

        // Create Transaction

        //get or create payment type and channel
        const transPaymentType = data.authorization?.channel?.toLowerCase() || 'unknown';
        const transPaymentChannel = data.authorization?.brand || 'unknown';

        const paymentType = await this.paymentTypeService.findOrCreateByName(transPaymentType);
        const paymentChannel = await this.paymentChannelService.findOrCreateByName(transPaymentChannel);

        this.logger.log(`Creating transaction for invoice ID: ${savedInvoice.invoice_id}`);

        const transaction = this.transactionRepo.create({
            transaction_id: generateTransactionId(),
            invoice: savedInvoice,
            transaction_amount: +plan.amount,
            transaction_status: PaymentStatusEnum.Paid,
            transaction_date: data.createdAt,
            transaction_type: await this.transactionTypeRepo.findOneBy({ transaction_type_name: TransactionTypeEnum.Debit }),
            transaction_details: `Initial payment for ${plan.name}`,
            provider_reference: data.authorization?.authorization_code,
            payment_type: paymentType,
            payment_channel: paymentChannel,
            provider: PaymentProviderEnum.PAYSTACK
        });
        await this.transactionRepo.save(transaction);
        this.logger.log(`Transaction created successfully with ID: ${transaction.transaction_id}`);
        return { subscription, invoice: savedInvoice, transaction };
    }
}




