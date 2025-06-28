// service
import { ResourceService } from './resource.service';

// decorator
import { Controller } from '../../core/common/decorators/route.decorator';

@Controller('/resource')
export class ResourceController {
    constructor(private readonly resourceService: ResourceService) {}
}
