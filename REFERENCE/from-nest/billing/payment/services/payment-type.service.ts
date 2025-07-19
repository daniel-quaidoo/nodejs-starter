import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentType } from "../entities/payment-type.entity";
import { Repository } from "typeorm";
import { CreatePaymentTypeDto } from "@lib/contracts/billing/payment/create-payment-type.dto";
import { UpdatePaymentTypeDto } from "@lib/contracts/billing/payment/update-payment-type.dto";


@Injectable()
export class PaymentTypeService{
    constructor(
        @InjectRepository(PaymentType) private readonly paymentTypeRepo: Repository<PaymentType>,
    ) {}
    
    create(dto: CreatePaymentTypeDto): Promise<PaymentType> {
        return this.paymentTypeRepo.save(dto);
    }

    findAll(): Promise<PaymentType[]>  {
        return this.paymentTypeRepo.find();
    }

    findOne(paymentTypeId: number): Promise<PaymentType>  {
        const paymentType = this.paymentTypeRepo.findOneByOrFail({ payment_type_id: paymentTypeId });

        if(!paymentType) throw new NotFoundException("Payment Type not found");

        return paymentType;
    }

    update(paymentTypeId: number, dto: UpdatePaymentTypeDto) {
        return this.paymentTypeRepo.update(paymentTypeId, dto);
    }

    async findOrCreateByName(payment_type_name:string): Promise<PaymentType>{
        let paymentType = await this.paymentTypeRepo.findOne({where: {payment_type_name}})

        if(!paymentType){
            paymentType = this.paymentTypeRepo.create({payment_type_name});
            await this.paymentTypeRepo.save(paymentType);
        }

        return paymentType;
    }

    remove(paymentTypeId: number) {
        return this.paymentTypeRepo.delete(paymentTypeId);
    }
}