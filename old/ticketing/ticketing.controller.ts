import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { TicketingService } from './ticketing.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketingController {
    constructor(private readonly ticketService: TicketingService) {}

    @Post()
    create(@Body() dto: CreateTicketDto) {
        return this.ticketService.create(dto);
    }

    @Get()
    getAllTickets(){
        return this.ticketService.findAll();
    }

    @Get(':caseNumber')
    getOneTicket(@Param('caseNumber') caseNumber:string){
        return this.ticketService.findOne(caseNumber);
    }

    @Patch(':caseNumber')
    updateTicket(@Param('caseNumber') caseNumber:string, @Body() dto: UpdateTicketDto){
        return this.ticketService.update(caseNumber, dto)
    }

    @Delete(':caseNumber')
    deleteTicket(@Param('caseNumber') caseNumber:string){
        return this.ticketService.remove(caseNumber)
    }
}
