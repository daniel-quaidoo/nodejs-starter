import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TransactionType } from "../entities/transaction-type.entity";
import { Repository } from "typeorm";
import { CreateTransactionTypeDto } from "@lib/contracts/billing/transaction/create-transaction-type.dto";
import { TransactionTypeEnum } from "@lib/contracts/billing/enums/transaction-type.enum";



@Injectable()
export class TransactionTypeService{

    constructor(
        @InjectRepository(TransactionType) private readonly transTypeRepo: Repository< TransactionType>
    ){}

    async create(dto: CreateTransactionTypeDto): Promise<TransactionType> {
        const transactionType = this.transTypeRepo.create(dto);
        return this.transTypeRepo.save(transactionType);
      }
    
    async findAll(): Promise<TransactionType[]> {
    return this.transTypeRepo.find();
    }

    async findOne(transTypeid: number): Promise<TransactionType> {
    const transactionType = await this.transTypeRepo.findOneBy({ transaction_type_id: transTypeid });
    if (!transactionType) {
        throw new NotFoundException('Transaction type not found');
    }
    return transactionType;
    }

    async findOneByName(name: TransactionTypeEnum): Promise <TransactionType>{
    const transactionType = await this.transTypeRepo.findOneBy({transaction_type_name: name});
    if (!transactionType) {
        throw new NotFoundException(`Transaction type '${name}' not found`);
        }
        return transactionType;
    }

    async update(transTypeid: number, dto: CreateTransactionTypeDto): Promise<TransactionType> {
    const transactionType = await this.findOne(transTypeid);
    Object.assign(transactionType, dto);
    return this.transTypeRepo.save(transactionType);
    }

    async remove(transTypeid: number): Promise<void> {
    const transactionType = await this.findOne(transTypeid);
    await this.transTypeRepo.remove(transactionType);
    }
}