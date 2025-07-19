import { Controller, Get, Post, Body, Param, Delete, Patch, Query, DefaultValuePipe, ParseEnumPipe } from '@nestjs/common';
//entity


//service
import { InvoiceService } from '../services/invoice.service';

//dto
import { CreateInvoiceDto } from '../dto/create-invoice.dto';
import { UpdateInvoiceDto } from '../dto/update-invoice.dto';
import { InvoicePageOptionsDto } from '@lib/contracts/billing/invoice/invoice-page-options.dto';

@Controller('')
export class InvoiceController {
    constructor(private readonly invoiceService: InvoiceService){}

    @Post()
    create(
        @Body() dto: CreateInvoiceDto,
    ){
        return this.invoiceService.createInvoice(dto);
    }


    @Get()
    getInvoices(@Query() options: InvoicePageOptionsDto) {
      if (options.status) {
        return this.invoiceService.findAllByStatusPaginated(options.status, options);
      }
      return this.invoiceService.findAllPaginated(options);
    }
    

    @Get(':invoiceId')
    findOne(
        @Param('invoiceId') invoiceId:string
    ){
        return this.invoiceService.findOne(invoiceId)
    }


    @Patch(':invoiceId')
    update(
        @Param('invoiceId') invoiceId: string,
        @Body() dto: UpdateInvoiceDto
    ){
        return this.invoiceService.updateInvoice(invoiceId, dto)
    }

    @Delete(':invoiceId')
    delete(
        @Param('invoiceId') invoiceId:string
    ){
        return this.invoiceService.delete(invoiceId)
    }
}

