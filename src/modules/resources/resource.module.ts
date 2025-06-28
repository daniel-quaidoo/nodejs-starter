// service
import { ResourceService } from './resource.service';

// decorator
import { Module } from '../../core/common/di/module.decorator';

// controller
import { ResourceController } from './resource.controller';

@Module({
    imports: [],
    controllers: [ResourceController],
    services: [ResourceService],
    exports: [ResourceService],
})
export class ResourceModule {}
