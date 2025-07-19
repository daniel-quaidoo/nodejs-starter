import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { TransactionService } from "../../transaction/services/transaction.service";
import { PaymentTypeService } from "../services/payment-type.service";
import { PaymentChannelService } from "../services/payment-channel.service";
import { InvoiceService } from "../../invoice/services/invoice.service";
import { TransactionTypeService } from "../../transaction/services/transaction-type.service";
import { ConfigService } from "@nestjs/config";
import { InitializePaymentDto } from "../dto/initialize-payment.dto";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { TransactionTypeEnum } from "@lib/contracts/billing/enums/transaction-type.enum";
import { firstValueFrom } from "rxjs";
import { generateTransactionId } from "../../utils/transaction-id.utils";
import { PaymentProviderEnum } from "@lib/contracts/billing/enums/payment-provider.enum";
import { InjectRepository } from "@nestjs/typeorm";
import { Invoice } from "../../invoice/entities/invoice.entity";
import { Repository } from "typeorm";


@Injectable()
export class PayStackService {

    private readonly logger = new Logger(PayStackService.name);

    
    constructor(
        @InjectRepository(Invoice)
        private readonly invoiceRepository: Repository<Invoice>,
        private readonly httpService: HttpService,
        private readonly transactionService: TransactionService,
        private readonly paymentTypeService: PaymentTypeService,
        private readonly paymentChannelService: PaymentChannelService,
        private readonly invoiceService: InvoiceService,
        private readonly transactionTypeService: TransactionTypeService,
        private readonly configService: ConfigService
    ){}

    // Function to initialise payment
    async initializePayment(dto: InitializePaymentDto){
        this.logger.log('PayStackService initialized');
        const invoice = await this.invoiceService.findOne(dto.invoiceId);

        if(invoice.status == PaymentStatusEnum.Paid || invoice.date_paid){
            throw new BadRequestException('This invoice has already been paid.');
        }

        const transactionType = await this.transactionTypeService.findOneByName(TransactionTypeEnum.Debit);

        const callbackBase = this.configService.get('PAYSTACK_CALLBACK_BASE');
        const callbackUrl = `${callbackBase}/billing/payment/paystack/callback/invoice`;

        this.logger.log(`callbackUrl: ${callbackUrl}`);

        const paystackPayload = {
            email: invoice.issued_to.email,
            amount: Math.round(invoice.invoice_amount * 100),
            callback_url: callbackUrl,
        };


        const headers= {
            Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
        };

        const response = await firstValueFrom(
            this.httpService.post('https://api.paystack.co/transaction/initialize', paystackPayload, { headers })
        );

        this.logger.log(`Paystack response data: ${JSON.stringify(response.data)}`);

        const paystackData = response.data.data;
        

        // Update invoice provider record with provider chosen
        invoice.provider = PaymentProviderEnum.PAYSTACK;
        await this.invoiceRepository.save(invoice);
            
        //create transaction record
        const transaction = await this.transactionService.create({
            transaction_id: generateTransactionId(),
            payment_type: null,
            payment_channel: null,
            transaction_date: new Date(),
            transaction_details: null,
            transaction_type:transactionType ,
            invoice: invoice,
            transaction_amount: invoice.invoice_amount,
            transaction_status: PaymentStatusEnum.Pending,
            provider_reference: paystackData.reference,  
            provider: PaymentProviderEnum.PAYSTACK,

        });

        return {
            status: 'success',
            authorization_url: paystackData.authorization_url,
            transaction_id: transaction.transaction_id,
            reference: paystackData.reference,
        };
    }


    //Callback function to verify payment from an invoice
    async verifyInvoicePayment(reference: string) {
        const headers = {
          Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
        };

        try {
            const response = await firstValueFrom(
                this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers })
            );
        
            const paystackData = response.data.data;

            // this.logger.log(`paystackData: ${JSON.stringify(paystackData)}`);
            if (!paystackData) throw new Error("Invalid response from Paystack");
        

            const transPaymentType = paystackData.authorization?.channel?.toLowerCase() || 'unknown';
            const transPaymentChannel = paystackData.authorization?.brand || 'unknown';


            const paymentType = await this.paymentTypeService.findOrCreateByName(transPaymentType);
            const paymentChannel = await this.paymentChannelService.findOrCreateByName(transPaymentChannel);
        
            // SUCCESSFUL PAYMENT FLOW
            if (paystackData.status === 'success') {
        
                return {
                    success: true,
                    message: 'Payment Successful',
                    paystackData,
                };
            }
      
            //  UNSUCCESSFUL PAYMENT FLOW
            await this.transactionService.updateWithPaymentInfo(reference, {
                status: PaymentStatusEnum.Unpaid,
                payment_type: paymentType,
                payment_channel: paymentChannel,
            });

        
            return {
                success: false,
                message: 'Payment Failed or Not Completed',
                paystackData,
            };
            } catch (error) {
            this.logger.error(`Invoice verify failed: ${error.message}`);
            throw new Error(
                
                `Paystack verification error: ${error?.response?.data?.message || error.message || 'Unknown error'}`
                
            );
            
            }
            
    }
    
    //Callback function to verify payment from a subscription
    async verifySubscriptionPayment(reference: string) {
        const headers = {
            Authorization: `Bearer ${this.configService.get('PAYSTACK_SECRET_KEY')}`,
        };

        try {
            const response = await firstValueFrom(
            this.httpService.get(`https://api.paystack.co/transaction/verify/${reference}`, { headers })
            );

            const paystackData = response.data.data;
            if (!paystackData) throw new Error("Invalid response from Paystack");

            // Check if successful
            if (paystackData.status === 'success') {
            this.logger.log(`Subscription payment successful: ${reference}`);

            // ✅ Optional: save to a payment_attempts table or audit trail
            return {
                success: true,
                message: 'Subscription payment successful',
                paystackData,
            };
            }

            return {
                success: false,
                message: 'Subscription payment failed or incomplete',
                paystackData,
            };

        } catch (error) {
            this.logger.error(`Subscription verify failed: ${error.message}`);
            throw new Error(
                `Paystack verification error: ${error?.response?.data?.message || error.message || 'Unknown error'}`
            );
        }
    }
    
}