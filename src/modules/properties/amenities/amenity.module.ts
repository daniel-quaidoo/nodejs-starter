// service
import { AmenityService } from './amenity.service';

// controller
import { AmenityController } from './amenity.controller';

// decorator
import { Module } from '../../../core/common/di/module.decorator';

@Module({
    controllers: [AmenityController],
    services: [AmenityService],
    exports: [AmenityService],
})
export class AmenityModule {}
