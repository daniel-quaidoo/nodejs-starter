

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Refund } from './entities/refund.entity';
import { RefundController } from './controllers/refund.controller';
import { RefundService } from './services/refund.service';
import { TransactionModule } from '../transaction/transaction.module';
import { Transaction } from '../transaction/entities/transaction.entity';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [TypeOrmModule.forFeature([Refund, Transaction]),
        TransactionModule,
        HttpModule,
        ConfigModule,
    ],
    controllers: [RefundController],
    providers: [RefundService],
    exports: [RefundService, TypeOrmModule.forFeature([Refund])],
})
export class RefundsModule { }
