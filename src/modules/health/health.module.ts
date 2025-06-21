// service
import { HealthService } from './health.service';

// module
import { Module } from '../../core/common/di/module.decorator';

// controller
import { HealthController } from './health.controller';

@Module({
    repositories: [],
    controllers: [HealthController],
    services: [HealthService],
})
export class HealthModule {}
