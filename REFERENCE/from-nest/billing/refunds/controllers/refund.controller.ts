
import { Body, Controller, Post } from '@nestjs/common';
import { RefundService } from '../services/refund.service';
import { InitiateRefundDto } from '../dto/initiate-refund.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Refunds')
@Controller()
export class RefundController { 
    constructor(
        private readonly refundService: RefundService,
    ){}

    @Post()
    InitiateRefundDto(
        @Body() initiateRefundDto: InitiateRefundDto,
    ){
        return this.refundService.initiateRefund(initiateRefundDto);
    }
}
