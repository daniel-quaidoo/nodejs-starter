import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    PrimaryGeneratedColumn,
    TableInheritance,
} from 'typeorm';

// entity
import { BaseModel } from '../../../../core/common';
import { PropertyAssignment } from './property-assignment.entity';

// enum
import { PropertyStatus } from '../../../../shared/properties/properties.enum';

@Entity('property_unit_assoc')
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class PropertyUnitAssoc extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    propertyUnitAssocId: string;

    @Column({
        type: 'enum',
        enum: PropertyStatus,
        default: PropertyStatus.AVAILABLE,
    })
    propertyStatus: PropertyStatus;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    securityDeposit: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    commission: number;

    @Column({ type: 'decimal', precision: 8, scale: 2 })
    floorSpace: number;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'boolean', default: false })
    hasAmenities: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @OneToMany(() => PropertyAssignment, propertyAssignment => propertyAssignment.propertyUnit)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    assignments: PropertyAssignment[];
}
