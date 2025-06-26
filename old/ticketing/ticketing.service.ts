import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


//entity
import { Ticket } from './entities/ticket.entity';

//dto
import { CreateTicketDto } from '@lib/contracts/ticketing/create-ticket.dto';
import { UpdateTicketDto } from '@lib/contracts/ticketing/update-ticket.dto';

@Injectable()
export class TicketingService {
    constructor(
        @InjectRepository(Ticket) private readonly ticketRepo: Repository<Ticket>
    ){}

    
    async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
        const ticket = this.ticketRepo.create(createTicketDto);
        return this.ticketRepo.save(ticket);
    }

    async findAll(): Promise<Ticket[]> {
        return this.ticketRepo.find();
    }

    async findOne(case_number: string): Promise<Ticket> {
        const ticket = await this.ticketRepo.findOneBy({ case_number });
        if (!ticket) throw new NotFoundException('Ticket not found');
        return ticket;
    }

    async update(case_number: string, updateDto: UpdateTicketDto): Promise<Ticket> {
        const ticket = await this.findOne(case_number);
        const updated = this.ticketRepo.merge(ticket, updateDto);
        return this.ticketRepo.save(updated);
    }

    async remove(case_number: string): Promise<void> {
        const ticket = await this.findOne(case_number);
        await this.ticketRepo.remove(ticket);
    }

}


