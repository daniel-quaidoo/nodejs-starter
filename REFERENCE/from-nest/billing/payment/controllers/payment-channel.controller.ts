import { Controller , Post, Get, Patch, Delete, Param, Body} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentTypeService } from "../services/payment-type.service";
import { CreatePaymentTypeDto } from "../dto/create-payment-type.dto";
import { UpdatePaymentTypeDto } from "../dto/update-payment-type.dto";
import { PaymentChannelService } from "../services/payment-channel.service";
import { CreatePaymentChannelDto } from "../dto/create-payment-channel.dto";
import { UpdatePaymentChannelDto } from "../dto/update-payment-channel.dto";


@ApiTags('Payment Channel')
@Controller('payment-channel')
export class PaymentChannelController{
    constructor(private readonly service: PaymentChannelService) {}

    @Post()
    create(@Body() dto: CreatePaymentChannelDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':paymentChannelId')
    findOne(@Param('paymentChannelId') paymentChannelId: number) {
        return this.service.findOne(paymentChannelId);
    }

    @Patch(':paymentChannelId')
    update(@Param('paymentChannelId') paymentChannelId: number, @Body() dto: UpdatePaymentChannelDto) {
        return this.service.update(paymentChannelId, dto);
    }

    @Delete(':paymentChannelId')
    remove(@Param('paymentChannelId') paymentChannelId: number) {
        return this.service.remove(paymentChannelId);
    }
}