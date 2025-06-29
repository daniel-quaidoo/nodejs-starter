// service
import { PropertyService } from './properties.service';

// decorator
import { Module } from '../../core/common/di/module.decorator';

// entities
import { Property } from './entities/property.entity';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';
import { PropertyType } from './entities/property-type.entity';
import { Unit } from './entities/unit.entity';
import { UnitType } from './entities/unit-type.entity';

// controller
import { PropertyController } from './properties.controller';

@Module({
    imports: [Property, PropertyType, Unit, UnitType, PropertyUnitAssoc],
    controllers: [PropertyController],
    services: [PropertyService],
    exports: [Property, PropertyType, Unit, UnitType, PropertyUnitAssoc, PropertyService],
})
export class PropertiesModule {}
