import { TypeOrmModule } from "@nestjs/typeorm";
import { TransactionController } from "./controllers/transaction.controller";
import { TransactionService } from "./services/transaction.service";
import { TransactionType } from "./entities/transaction-type.entity";
import { Transaction } from "./entities/transaction.entity";
import { forwardRef, Module } from "@nestjs/common";
import { TransactionTypeController } from "./controllers/transaction-type.controller";
import { TransactionTypeService } from "./services/transaction-type.service";
import { Invoice } from "../invoice/entities/invoice.entity";
import { PaymentModule } from "../payment/payment.module";
import { PaymentType } from "../payment/entities/payment-type.entity";
import { InvoiceModule } from "../invoice/invoice.module";


@Module({
    imports: [
        TypeOrmModule.forFeature([TransactionType, Transaction, Invoice]),
        forwardRef(() => PaymentModule),
        forwardRef(() => InvoiceModule)
    ],
    controllers: [TransactionController, TransactionTypeController],
    providers: [TransactionService, TransactionTypeService],
    exports: [TransactionService, TransactionTypeService, TypeOrmModule]
})

export class TransactionModule{}