import { Controller , Post, Get, Patch, Delete, Param, Body} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { PaymentTypeService } from "../services/payment-type.service";
import { CreatePaymentTypeDto } from "../dto/create-payment-type.dto";
import { UpdatePaymentTypeDto } from "../dto/update-payment-type.dto";


@ApiTags('Payment Type')
@Controller('payment-type')
export class PaymentTypeController{
    constructor(private readonly service: PaymentTypeService) {}

    @Post()
    create(@Body() dto: CreatePaymentTypeDto) {
        return this.service.create(dto);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':paymentTypeId')
    findOne(@Param('paymentTypeId') paymentTypeId: number) {
        return this.service.findOne(paymentTypeId);
    }

    @Patch(':paymentTypeId')
    update(@Param('paymentTypeId') paymentTypeId: number, @Body() dto: UpdatePaymentTypeDto) {
        return this.service.update(paymentTypeId, dto);
    }

    @Delete(':paymentTypeId')
    remove(@Param('paymentTypeId') paymentTypeId: number) {
        return this.service.remove(paymentTypeId);
    }
}