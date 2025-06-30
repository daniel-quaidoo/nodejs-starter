// service
import { PropertyService } from './property.service';

// decorator
import { Module } from '../../../core/common/di/module.decorator';

// entities
import { Unit } from '../units/entities/unit.entity';
import { Property } from './entities/property.entity';
import { UnitType } from '../units/entities/unit-type.entity';
import { PropertyType } from './entities/property-type.entity';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

// controller
import { PropertyController } from './property.controller';

@Module({
    imports: [Property, PropertyType, Unit, UnitType, PropertyUnitAssoc],
    controllers: [PropertyController],
    services: [PropertyService],
    exports: [Property, PropertyType, Unit, UnitType, PropertyUnitAssoc, PropertyService],
})
export class PropertiesModule {}
