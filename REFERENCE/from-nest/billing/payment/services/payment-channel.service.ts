import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaymentType } from "../entities/payment-type.entity";
import { Repository } from "typeorm";
import { CreatePaymentTypeDto } from "@lib/contracts/billing/payment/create-payment-type.dto";
import { UpdatePaymentTypeDto } from "@lib/contracts/billing/payment/update-payment-type.dto";
import { PaymentChannel } from "../entities/payment-channel.entity";
import { CreatePaymentChannelDto } from "@lib/contracts/billing/payment/create-payment-channel.dto";
import { UpdatePaymentChannelDto } from "@lib/contracts/billing/payment/update-payment-channel.dto";


@Injectable()
export class PaymentChannelService{
    constructor(
        @InjectRepository(PaymentChannel) private readonly paymentChannelRepo: Repository<PaymentChannel>,
    ) {}
    
    create(dto: CreatePaymentChannelDto): Promise<PaymentChannel> {
        return this.paymentChannelRepo.save(dto);
    }

    findAll(): Promise<PaymentChannel[]>  {
        return this.paymentChannelRepo.find();
    }

    findOne(paymentChannelId: number): Promise<PaymentChannel>  {
        const paymentChannel = this.paymentChannelRepo.findOneByOrFail({ payment_channel_id: paymentChannelId });

        if(!paymentChannel) throw new NotFoundException("Payment Channel not found");

        return paymentChannel;
    }

    update(paymentChannelId: number, dto: UpdatePaymentChannelDto) {
        return this.paymentChannelRepo.update(paymentChannelId, dto);
    }

    async findOrCreateByName(payment_channel_name:string): Promise<PaymentChannel>{
        let paymentChannel = await this.paymentChannelRepo.findOne({where: {payment_channel_name}})

        if(!paymentChannel){
            paymentChannel = this.paymentChannelRepo.create({payment_channel_name});
            await this.paymentChannelRepo.save(paymentChannel);
        }

        return paymentChannel;
    }

    remove(paymentChannelId: number) {
        return this.paymentChannelRepo.delete(paymentChannelId);
    }
}