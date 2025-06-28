// service
import { PropertyService } from './properties.service';

// decorator
import { Controller } from '../../core/common/decorators/route.decorator';

@Controller('/properties')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}
}
