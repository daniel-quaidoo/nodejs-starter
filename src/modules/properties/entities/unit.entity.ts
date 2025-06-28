import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';

// entity
import { Property } from './property.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

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

    @ManyToOne(() => Property, property => property.units, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'property_id' })
    property: Property;

    @Column({ name: 'property_id', type: 'uuid' })
    propertyId: string;
}
