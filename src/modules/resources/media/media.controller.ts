// service
import { MediaService } from './media.service';

// decorator
import { Controller } from '../../../core/common/decorators/route.decorator';

@Controller('/media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}
}
