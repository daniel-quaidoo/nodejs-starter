// service
import { MediaService } from './media.service';

// decorator
import { Module } from '../../../core/common/di/module.decorator';

// controller
import { MediaController } from './media.controller';

@Module({
    imports: [],
    controllers: [MediaController],
    services: [MediaService],
    exports: [MediaService],
})
export class MediaModule {}
