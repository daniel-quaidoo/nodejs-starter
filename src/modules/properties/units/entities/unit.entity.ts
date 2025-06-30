import { Column, Entity, Index } from 'typeorm';

// entity
import { PropertyUnitAssoc } from '../../property/entities/property-unit-assoc.entity';

@Index('IDX_UNIT_PROPERTY_ID', ['propertyId'])
@Index('IDX_UNIT_CODE', ['propertyUnitCode'])
@Index('IDX_UNIT_STATUS', ['propertyStatus'])
@Index('IDX_UNIT_AMOUNT', ['amount'])
@Entity('units')
export class Unit extends PropertyUnitAssoc {
    @Column({ length: 128 })
    propertyUnitCode: string;

    @Column({ type: 'int' })
    propertyFloorId: number;

    @Column({ name: 'property_id', type: 'uuid' })
    propertyId: string;
}
