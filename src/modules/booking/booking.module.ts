// decorator
import { Module } from '../../core/common/di/module.decorator';

// service
import { BookingService } from './booking.service';

// controller
import { BookingController } from './booking.controller';

// entity
import { Viewing } from './entities/viewing.entity';
import { Reservation } from './entities/reservation.entity';

@Module({
    imports: [Viewing, Reservation],
    services: [BookingService],
    controllers: [BookingController],
    exports: [BookingService],
})
export class BookingModule {}
