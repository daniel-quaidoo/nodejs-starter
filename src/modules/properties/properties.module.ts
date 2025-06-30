// service
import { PropertiesService } from './properties.service';

// controller
import { PropertiesController } from './properties.controller';

// decorator
import { Module } from '../../core/common/di/module.decorator';

@Module({
    imports: [],
    controllers: [PropertiesController],
    services: [PropertiesService],
    exports: [PropertiesService],
})
export class PropertiesModule {}
