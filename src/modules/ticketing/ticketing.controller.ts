// service
import { TicketService } from './ticketing.service';

// decorator
import { Controller } from '../../core/common/decorators/route.decorator';

@Controller('/tickets')
export class TicketController {
    constructor(private readonly ticketService: TicketService) {}
}
