import { Controller, Post, Get, Param, Body, Patch, Delete } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TransactionTypeService } from '../services/transaction-type.service';
import { CreateTransactionTypeDto } from '@lib/contracts/billing/transaction/create-transaction-type.dto';

@ApiTags('Transaction Type')
@Controller('transaction-type')
export class TransactionTypeController {
    constructor(private readonly service: TransactionTypeService) {}

    @Post()
    create(@Body() dto: CreateTransactionTypeDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':transTypeid')
    findOne(@Param('transTypeid') transTypeid: number) {
        return this.service.findOne(transTypeid);
    }

    @Patch(':transTypeid')
    update(@Param('transTypeid') transTypeid: number, @Body() dto: CreateTransactionTypeDto) {
        return this.service.update(transTypeid, dto);
    }

    @Delete(':transTypeid')
    remove(@Param('transTypeid') transTypeid: number) {
        return this.service.remove(transTypeid);
    }
}
