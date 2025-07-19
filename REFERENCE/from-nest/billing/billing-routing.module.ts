// billing-routing.module.ts
import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { BillingModule } from './billing.module';
import { InvoiceModule } from './invoice/invoice.module';
import { TransactionModule } from './transaction/transaction.module';
import { PaymentModule } from './payment/payment.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { EntityBillableModule } from './entity-billable/entity-billable.module';
import { RefundsModule } from './refunds/refunds.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'billing',
        module: BillingModule,
        children: [
          {
            path: 'invoice',
            module: InvoiceModule,
          },
          {
            path: 'transaction',
            module: TransactionModule,
          },
          {
            path: 'payment',
            module: PaymentModule,
          },
          {
            path: 'entity-billable',
            module: EntityBillableModule,
          },
          {
            path: 'subscription',
            module: SubscriptionModule,
          },
          {
            path: 'refunds',
            module: RefundsModule,
          },
        ],
      },
    ]),
  ],
})
export class BillingRoutingModule {}
