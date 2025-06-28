import { Column, Entity, Index, OneToMany } from 'typeorm';

// entity
import { Unit } from './unit.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

// enum
import { PropertyType } from '../../../shared/properties/properties.enum';

@Index('IDX_PROPERTY_STATUS', ['propertyStatus'])
@Index('IDX_PROPERTY_AMOUNT', ['amount'])
@Index('IDX_PROPERTY_TYPE_STATUS', ['propertyType', 'propertyStatus'])
@Entity('property')
export class Property extends PropertyUnitAssoc {
    @Column({ length: 255 })
    name: string;

    @Column({
        type: 'enum',
        enum: PropertyType,
    })
    propertyType: PropertyType;

    @Column({ type: 'int' })
    numUnits: number;

    @Column({ type: 'int' })
    numBathrooms: number;

    @Column({ type: 'int' })
    numGarages: number;

    @Column({ type: 'boolean', default: false })
    hasBalconies: boolean;

    @Column({ type: 'boolean', default: false })
    hasParkingSpace: boolean;

    @Column({ type: 'boolean', default: false })
    petsAllowed: boolean;

    @OneToMany(() => Unit, unit => unit.property)
    units: Unit[];
}
