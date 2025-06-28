// service
import { BookingService } from './booking.service';

// decorator
import { Controller } from '../../core/common/decorators/route.decorator';

@Controller('/booking')
export class BookingController {
    constructor(private readonly bookingService: BookingService) {}
}
