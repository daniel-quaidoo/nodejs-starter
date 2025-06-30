import { Column, Entity, Index, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

// entity
import { PropertyType } from './property-type.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';
import { Media } from '../../../resources/media/entities/media.entity';
import { EntityAmenities } from '../../amenities/entities/entity-amenities.entity';

// enum
import { PropertyType as PropertyTypeEnum } from '../../../../shared/properties/properties.enum';

@Index('IDX_PROPERTY_STATUS', ['propertyStatus'])
@Index('IDX_PROPERTY_AMOUNT', ['amount'])
@Index('IDX_PROPERTY_TYPE_STATUS', ['propertyType', 'propertyStatus'])
@Entity('property')
export class Property extends PropertyUnitAssoc {
    @Column({ length: 255 })
    name: string;

    @Column({
        type: 'enum',
        enum: PropertyTypeEnum,
    })
    propertyType: PropertyTypeEnum;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    securityDeposit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    commission: number;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    floorSpace: number;

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

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ManyToOne(() => PropertyType, propertyType => propertyType.properties)
    @JoinColumn({ name: 'property_type_id' })
    propertyTypeEntity: PropertyType;

    @OneToMany(() => EntityAmenities, entityAmenities => entityAmenities.entity)
    amenities: EntityAmenities[];

    @OneToMany(() => Media, media => media.property)
    media: Media[];
}
