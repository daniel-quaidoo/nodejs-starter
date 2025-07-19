import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../entities/transaction.entity";
import { Repository } from "typeorm";
import { PaymentType } from "../../payment/entities/payment-type.entity";
import { TransactionType } from "../entities/transaction-type.entity";
import { Invoice } from "../../invoice/entities/invoice.entity";
import { CreateTransactionDto } from "@lib/contracts/billing/transaction/create-transaction.dto";
import { UpdateTransactionDto } from "@lib/contracts/billing/transaction/update-transaction.dto";
import { generateTransactionId } from "../../utils/transaction-id.utils";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { ref } from "joi";
import { PaymentChannel } from "../../payment/entities/payment-channel.entity";
import { PageOptionsDto } from "@app/common/dto/page-meta/page-optional.dto";
import { PageDto } from "@app/common/dto/page.dto";
import { paginate } from "@app/common/utils/paginate";


@Injectable()
export class TransactionService{

    constructor(
        @InjectRepository(Transaction) private readonly transRepo: Repository<Transaction>,
        @InjectRepository(PaymentType) private readonly paymentTypeRepo: Repository<PaymentType>,
        @InjectRepository(TransactionType) private readonly transTypeRepo: Repository<TransactionType>,
        @InjectRepository(Invoice) private readonly invoiceRepo: Repository<Invoice>,
    ){}

    async create(dto: CreateTransactionDto): Promise< Transaction>{
        let paymentType = null;
        if (dto.payment_type?.payment_type_id) {
          paymentType = await this.paymentTypeRepo.findOneByOrFail({ payment_type_id: dto.payment_type.payment_type_id });
        }
      

        const transType = await this.transTypeRepo.findOneByOrFail({transaction_type_id: dto.transaction_type.transaction_type_id})
        const invoice = await this.invoiceRepo.findOneByOrFail({invoice_id: dto.invoice.invoice_id})

        const transaction = this.transRepo.create({
            transaction_id: generateTransactionId(),
            transaction_date: new Date(dto.transaction_date),
            transaction_details: dto.transaction_details,
            transaction_amount: dto.transaction_amount,
            transaction_status: dto.transaction_status,
            provider: dto.provider,
            provider_reference: dto.provider_reference,
            invoice,
            payment_type: paymentType,
            transaction_type: transType,
        })

        return this.transRepo.save(transaction);
    }


    async findAllPaginated(pageOptionsDto:PageOptionsDto): Promise<PageDto<Transaction>>{

      return paginate(this.transRepo, pageOptionsDto,{
        relations:['invoice', 'payment_type', 'transaction_type']})
    }

    async findAllByStatusPaginated(status: PaymentStatusEnum, pageOptionsDto:PageOptionsDto): Promise<PageDto<Transaction>>{
      const allowedOrderFields = ['transaction_date', 'transaction_amount', 'transaction_status'];

      if (!allowedOrderFields.includes(pageOptionsDto.orderBy)) {
        throw new BadRequestException(`Invalid orderBy: ${pageOptionsDto.orderBy}`);
    }

      return paginate(this.transRepo, pageOptionsDto,{
        where: {transaction_status: status},
        relations:['invoice', 'payment_type', 'transaction_type']})
    }


    async findOne(transId:string): Promise<Transaction>{
        return this.transRepo.findOne({
            where: { transaction_id: transId },
            relations: ['invoice', 'payment_type', 'transaction_type'],
          });
    }

    async findOneByReference(reference_number:string): Promise <Transaction>{
        const transaction = await this.transRepo.findOneBy({provider_reference: reference_number});
        if (!transaction) {
            throw new NotFoundException(`Transaction not found`);
            }
            return transaction;
    }

    async update(transId: string, updateDto: UpdateTransactionDto): Promise<Transaction> {
        const transaction = await this.transRepo.findOne({ where: { transaction_id: transId }, relations: ['invoice', 'payment_type', 'transaction_type'] });
    
        if (!transaction) {
          throw new Error('Transaction not found');
        }
    
        // if (updateDto.transaction_id) transaction.transaction_id = updateDto.transaction_id;
        if (updateDto.transaction_date) transaction.transaction_date = new Date(updateDto.transaction_date);
        if (updateDto.transaction_details) transaction.transaction_details = updateDto.transaction_details;
        if (updateDto.transaction_amount) transaction.transaction_amount = updateDto.transaction_amount;
        if (updateDto.transaction_status) transaction.transaction_status = updateDto.transaction_status;
        if (updateDto.provider_reference) transaction.provider_reference = updateDto.provider_reference;

        if (updateDto.transaction_type.transaction_type_id) {
          const transType = await this.transTypeRepo.findOne({ where: { transaction_type_id: updateDto.transaction_type.transaction_type_id } });
          if (transType) transaction.transaction_type = transType;
        }
        if (updateDto.invoice.invoice_id) {
          const invoice = await this.invoiceRepo.findOne({ where: { invoice_id: updateDto.invoice.invoice_id } });
          if (invoice) transaction.invoice = invoice;
        }
        if (updateDto.payment_type.payment_type_id) {
          const paymentType = await this.paymentTypeRepo.findOne({ where: { payment_type_id: updateDto.payment_type.payment_type_id} });
          if (paymentType) transaction.payment_type = paymentType;
        }
    
        return this.transRepo.save(transaction);
    }    

    async updateStatusByReference(reference:string, status: PaymentStatusEnum){
      const transaction = await this.findOneByReference(reference)

      transaction.transaction_status = status;
      return this.transRepo.save(transaction)
    }

    async updateWithPaymentInfo(
        reference:string,
        updateData:{
          status: PaymentStatusEnum,
          payment_type: PaymentType,
          payment_channel: PaymentChannel;
        },
      ): Promise <Transaction>{
        const transaction = await this.transRepo.findOneOrFail({where: {provider_reference: reference}, relations: ['invoice'],});
        
        transaction.transaction_status = updateData.status;
        transaction.payment_type = updateData.payment_type;
        transaction.payment_channel = updateData.payment_channel;

        return this.transRepo.save(transaction)
    }

    async delete(transId: string): Promise<void> {
        await this.transRepo.delete(transId);
    }

} 
