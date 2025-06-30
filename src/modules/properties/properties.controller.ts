// service
import { PropertiesService } from './properties.service';

// decorator
import { Controller } from '../../core/common/decorators/route.decorator';

@Controller('/properties')
export class PropertiesController {
    constructor(private readonly propertyService: PropertiesService) {}
}
