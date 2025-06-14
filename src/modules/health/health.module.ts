// service
import { HealthService } from './service/health.service';

// module
import { Module } from '../../core/common/di/module.decorator';

// controller
import { HealthController } from './controller/health.controller';

@Module({
    repositories: [],
    controllers: [HealthController],
    services: [HealthService],
})
export class HealthModule {}