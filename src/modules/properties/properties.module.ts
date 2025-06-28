// service
import { PropertyService } from './properties.service';

// decorator
import { Module } from '../../core/common/di/module.decorator';

// module
import { Unit } from './entities/unit.entity';
import { Property } from './entities/property.entity';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

// repository
// import { PropertyRepository } from './repository/property.repository';

// controller
import { PropertyController } from './properties.controller';

@Module({
    imports: [Property, Unit, PropertyUnitAssoc],
    controllers: [PropertyController],
    services: [PropertyService],
    exports: [Property, Unit, PropertyUnitAssoc, PropertyService],
})
export class PropertiesModule {}
