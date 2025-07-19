
import { Injectable, Logger } from '@nestjs/common';

import { callPaystackEndpoint } from '../../utils/paystack-endpoint.utils';
import { InitiateRefundDto } from '@lib/contracts/billing/refunds/initiate-refund.dto';
import { Repository } from 'typeorm';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { Refund } from '../entities/refund.entity';
import { InjectRepository } from '@nestjs/typeorm';

import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { PayStackRefundStatusEnum } from '@lib/contracts/billing/enums/paystack-refund-status.enum';

@Injectable()
export class RefundService { 
    private readonly logger = new Logger(RefundService.name)
    constructor(

        @InjectRepository(Transaction)
        private readonly transactionRepo: Repository<Transaction>,

        @InjectRepository(Refund)
        private readonly refundRepo: Repository<Refund>,

        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async initiateRefund(initiateRefundDto: InitiateRefundDto): Promise<any> {

        this.logger.log(`Initiating refund for transaction ID: ${initiateRefundDto.transactionId}`);
        const transaction = await this.transactionRepo.findOne({
            where: { transaction_id: initiateRefundDto.transactionId }
        });
        if(!transaction){
            throw new Error('Transaction not found');
        }

        const transReference = transaction.provider_reference;
 
        this.logger.log(`Transaction reference number: ${transReference}`);

        const createRefundResponse = await callPaystackEndpoint(
            this.httpService,
            this.configService,
            'https://api.paystack.co/refund',
            'POST',
            {
                transaction: transReference,
                amount: initiateRefundDto.amount * 100,
                customer_note: initiateRefundDto.reason,
            }
            );

        if (!createRefundResponse.success || !createRefundResponse.data) {
            this.logger.error('Failed to initiate refund', createRefundResponse);
            throw new Error('Failed to initiate refund');
        }

        // Save the refund locally
        const refund = this.refundRepo.create({
            transaction: transaction,
            amount: createRefundResponse.data.data.deducted_amount / 100,
            status: PayStackRefundStatusEnum.Pending,
            refund_reference: createRefundResponse.data.data.id || null,
            reason: initiateRefundDto.reason || null,
            created_at: createRefundResponse.data.data.createdAt,
            updated_at: createRefundResponse.data.data.updatedAt,
        });

        await this.refundRepo.save(refund);

        this.logger.log(`Refund saved to DB with status: ${refund.status}`);

        return {
            message: 'Refund initiated and saved as pending',
            data: createRefundResponse.data,
        };

    }
}
