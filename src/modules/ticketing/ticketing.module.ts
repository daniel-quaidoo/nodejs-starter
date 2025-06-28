// service
import { TicketService } from './ticketing.service';

// decorator
import { Module } from '../../core/common/di/module.decorator';

// controller
import { TicketController } from './ticketing.controller';

@Module({
    imports: [],
    controllers: [TicketController],
    services: [TicketService],
    exports: [TicketService],
})
export class TicketingModule {}
