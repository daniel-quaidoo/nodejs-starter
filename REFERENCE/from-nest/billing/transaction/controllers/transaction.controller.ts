import { Controller, Post , Get, Delete, Param, Body, Patch, Query, DefaultValuePipe, ParseEnumPipe} from "@nestjs/common";
import { TransactionService } from "../services/transaction.service";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateTransactionDto } from "../dto/create-transaction.dto";
import { UpdateTransactionDto } from "../dto/update-transaction.dto";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { TransactionPageOptionsDto } from "@lib/contracts/billing/transaction/transaction-page-options.dto";

@ApiTags('Transactions')
@Controller('')
export class TransactionController{
    constructor(
        private readonly transService: TransactionService
    ){}

    @Get()
    getTransactions(@Query() options: TransactionPageOptionsDto){
        if( options.status){
            return this.transService.findAllByStatusPaginated(options.status, options);
        }
        return this.transService.findAllPaginated(options);
    }


    @Get(':transId')
    findOne(@Param('transId') transId: string) {
        return this.transService.findOne(transId);
    }

}