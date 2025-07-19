import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { InitializePaymentDto } from "@lib/contracts/billing/payment/initialize-payment.dto";
import { PayStackService } from "../payment-providers/paystack.service";

@ApiTags('Payment Paystack')
@Controller('/paystack')
export class PayStackPaymentController{

    constructor(
        private readonly payStackService: PayStackService
    ){}

    @Post('initialize')
    async intializePayment(@Body() dto: InitializePaymentDto){
        return this.payStackService.initializePayment(dto)
    }

    @Get('callback/invoice')
    async handleInvoiceCallback(@Query('reference') reference: string){
        return this.payStackService.verifyInvoicePayment(reference);
    }

    @Get('callback/subscription')
    async handleSubscriptionCallback(@Query('reference') reference: string){
        return this.payStackService.verifySubscriptionPayment(reference);
    }


}