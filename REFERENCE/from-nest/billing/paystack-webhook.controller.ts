import {
  Controller,
  Post,
  Req,
  Headers,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Entities
import { User } from '../auth/users/entities/user.entity';
import { Subscription } from './subscription/entities/subscription.entity';
import { SubscriptionPlan } from './subscription/entities/subscription-plan.entity';
import { Transaction } from './transaction/entities/transaction.entity';


// Enums
import { SubscriptionStatusEnum } from '@lib/contracts/billing/enums/subscription-status.enum';
import { PaymentStatusEnum } from '@lib/contracts/billing/enums/payment-status.enum';
import { PayStackRefundStatusEnum } from '@lib/contracts/billing/enums/paystack-refund-status.enum';
import { Refund } from './refunds/entities/refund.entity';
import { SubscriptionSetupService } from './subscription/services/subscriptionsetup.service';
import { PaymentProviderEnum } from '@lib/contracts/billing/enums/payment-provider.enum';
import { PaymentTypeService } from './payment/services/payment-type.service';
import { PaymentChannelService } from './payment/services/payment-channel.service';
import { Invoice } from './invoice/entities/invoice.entity';

@Controller('webhook/paystack')
export class PaystackWebhookController {
  private readonly logger = new Logger(PaystackWebhookController.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan)
    private readonly planRepo: Repository<SubscriptionPlan>,
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Refund)
    private readonly refundRepo: Repository<Refund>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    private readonly subscriptionSetupService: SubscriptionSetupService,
    private readonly paymentTypeService: PaymentTypeService,
    private readonly paymentChannelService: PaymentChannelService,
  ) {}

  @Post()
  async handleWebhook(
    @Req() req: Request,
    @Headers('x-paystack-signature') signature: string,
  ) {
    const secret = this.configService.get<string>('PAYSTACK_SECRET_KEY');

    const hash = crypto
      .createHmac('sha512', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== signature) {
      throw new HttpException(
        'Invalid Paystack signature',
        HttpStatus.FORBIDDEN,
      );
    }

    const event = req.body;
    const type = event.event;
    const data = event.data;

    switch (type) {
      /** ---------------------------
       *  SUBSCRIPTION EVENTS
       *  --------------------------- */
  

      case 'subscription.create': {
        this.logger.log(`Received Paystack event: ${type}`);
        const email = data.customer.email;

        const user = await this.userRepo.findOne({ where: { email } });
        const plan = await this.planRepo.findOne({ where: { providerPlanCode: data.plan.plan_code } });

        if (!user || !plan) {
          this.logger.warn(`User or plan not found for subscription.create`);
          break;
        }

        try {
          await this.subscriptionSetupService.handleSubscriptionActivation(user, plan, data);
          this.logger.log(`Subscription activated, invoice and transaction created`);
        } catch (err) {
          this.logger.error(`Failed to handle subscription.create:`, err);
        }

        break;
      }

      case 'subscription.disable': {
        const code = data.subscription_code;
        await this.subscriptionRepo.update(
          { providerSubscriptionCode: code },
          { status: SubscriptionStatusEnum.Cancelled },
        );

        this.logger.log(`Subscription ${code} marked as cancelled.`);
        break;
      }

      case 'subscription.not_renew': {
        const code = data.subscription_code;
        await this.subscriptionRepo.update(
          { providerSubscriptionCode: code },
          { status: SubscriptionStatusEnum.NonRenewing },
        );
        this.logger.log(`Subscription ${code} marked as non-renewing.`);
        break;
      }

      case 'invoice.failed':
      case 'charge.failed': {
        const code = data.subscription?.subscription_code;
        if (code) {
          await this.subscriptionRepo.update(
            { providerSubscriptionCode: code },
            { status: SubscriptionStatusEnum.Attention },
          );
        }
        break;
      }
      /** ---------------------------
       *  TRANSACTION EVENTS
       *  --------------------------- */

      case 'charge.success': {

          this.logger.log(`Handling charge.success for reference: ${data.reference}`);

          // this.logger.log(`paystackwebhookData: ${JSON.stringify(data)}`);

          const reference = data.reference;

          //get the payment type and channel from the authorization data
          const transPaymentType = data.authorization?.channel?.toLowerCase() || 'unknown';
          const transPaymentChannel = data.authorization?.brand || 'unknown';

          //find or create the payment type and channel
          const paymentType = await this.paymentTypeService.findOrCreateByName(transPaymentType);
          const paymentChannel = await this.paymentChannelService.findOrCreateByName(transPaymentChannel);

          //find the related transaction by provider reference
          const transaction = await this.transactionRepo.findOne({
            where: { provider_reference: reference },
            relations: ['invoice'],
          });

          if (!transaction) {
            this.logger.warn(`Transaction not found for reference: ${reference}`);
            break;
          }

          //assign the transaction details to the transaction to update it
          transaction.transaction_status = PaymentStatusEnum.Paid;
          transaction.transaction_date = new Date(data.paid_at);
          transaction.payment_type = paymentType;
          transaction.payment_channel = paymentChannel;

          await this.transactionRepo.save(transaction);

          if (transaction.invoice) {

              const invoice = transaction.invoice;
              invoice.status = PaymentStatusEnum.Paid;
              invoice.date_paid = new Date(data.paid_at);

              await this.invoiceRepo.save(invoice);
          }

          this.logger.log(`Transaction and invoice updated for reference: ${reference}`);
          break;
        }

      case 'charge.dispute':
      case 'charge.resolved': 

      /** ---------------------------
       *  REFUND EVENTS
       *  --------------------------- */
      case 'refund.pending':
      case 'refund.processing':
      case 'refund.failed':
      case 'refund.processed': {
        const refundStatus = data.status;
        const reference = data.transaction_reference;
        console.log(`Processing refund event: ${type} for transaction ${JSON.stringify(data)}`);
        const refundRef = data.refund_reference || null;

        const refund = await this.refundRepo.findOne({
          where: {
            transaction: { provider_reference: reference },
          },
          relations: ['transaction'],
        });

        if (!refund) {
          this.logger.warn(`No matching refund found for transaction ${reference}`);
          break;
        }

        refund.status = refundStatus;
        refund.refund_reference = refundRef;
        await this.refundRepo.save(refund);

        if (refundStatus === PayStackRefundStatusEnum.Processed) {
          refund.status = PayStackRefundStatusEnum.Processed;
          refund.refund_reference = data.refund_reference || null;

        } else if (refundStatus === PayStackRefundStatusEnum.Failed) {
          refund.status = PayStackRefundStatusEnum.Failed;

        } else if (refundStatus === PayStackRefundStatusEnum.Pending) {
          refund.status = PayStackRefundStatusEnum.Pending;

        } else  {
          refund.status = PayStackRefundStatusEnum.Processing;
        }

        await this.transactionRepo.save(refund.transaction);

        this.logger.log(`Refund for ${reference} marked as ${refundStatus} with reference ${refundRef}`);
        break;
      }

      /** ---------------------------
       *  DEFAULT CASE
       *  --------------------------- */
      default:
        this.logger.log(`Unhandled Paystack event type: ${type}`);
        break;
    }

    return { received: true };
  }
}
