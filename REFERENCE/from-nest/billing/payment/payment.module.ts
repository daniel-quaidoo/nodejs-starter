import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PaymentType } from "./entities/payment-type.entity";
import { PaymentTypeController } from "./controllers/payment-type.controller";
import { PaymentTypeService } from "./services/payment-type.service";
import { HttpModule } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { TransactionModule } from "../transaction/transaction.module";
import { InvoiceModule } from "../invoice/invoice.module";
import { PaymentChannelController } from "./controllers/payment-channel.controller";
import { PaymentChannelService } from "./services/payment-channel.service";
import { PaymentChannel } from "./entities/payment-channel.entity";
import { PayStackPaymentController } from "./controllers/paystack-payment.controller";
import { PayStackService } from "./payment-providers/paystack.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentType, PaymentChannel]),
        HttpModule,
        forwardRef(() => TransactionModule),
        forwardRef(() => InvoiceModule),
    ],
    controllers: [PayStackPaymentController, PaymentTypeController, PaymentChannelController],
    providers: [
        PayStackService, 
        PaymentTypeService,
        PaymentChannelService,
        ConfigService,
    ],
    exports: [PayStackService, PaymentTypeService ,PaymentChannelService, TypeOrmModule]
})
export class PaymentModule {}