import { Module } from '@nestjs/common';
import { TicketingController } from './ticketing.controller';
import { TicketingService } from './ticketing.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  controllers: [TicketingController],
  providers: [TicketingService]
})
export class TicketingModule {}
