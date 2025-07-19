import { Module } from '@nestjs/common';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';
import { TypeOrmModule } from '@nestjs/typeorm';

//modules

import { InvoiceModule } from './invoice/invoice.module';
import { PaymentModule } from './payment/payment.module';
import { TransactionModule } from './transaction/transaction.module';

import { EntityBillableModule } from './entity-billable/entity-billable.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { PaystackWebhookController } from './paystack-webhook.controller';
import { UsersModule } from '../auth/users/users.module';
import { RefundsModule } from './refunds/refunds.module';
import { RefundController } from './refunds/controllers/refund.controller';
import { SubscriptionSetupService } from './subscription/services/subscriptionsetup.service';
import { InvoiceItem } from './invoice/entities/invoice-item.entity';
import { Invoice } from './invoice/entities/invoice.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceModule, InvoiceItem, Invoice]),
    PaymentModule,
    TransactionModule,
    EntityBillableModule,
    SubscriptionModule,
    UsersModule,
    RefundsModule,

  ],
  controllers: [ BillingController, PaystackWebhookController, RefundController],
  providers: [BillingService, SubscriptionSetupService]
})
export class BillingModule {}
