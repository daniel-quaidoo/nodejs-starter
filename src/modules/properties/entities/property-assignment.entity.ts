import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { User } from '../../auth/users/entities/user.entity';
import { PropertyUnitAssoc } from './property-unit-assoc.entity';

// enum
import { PropertyAssignmentType } from '../../../shared/properties/properties.enum';

@Index('IDX_ASSIGNMENT_PROPERTY_USER', ['propertyUnitAssocId', 'userId'])
@Index('IDX_ASSIGNMENT_TYPE', ['assignmentType'])
@Index('IDX_ASSIGNMENT_DATES', ['dateFrom', 'dateTo'])
@Entity('property_assignment')
export class PropertyAssignment extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    propertyAssignmentId: string;

    @ManyToOne(() => PropertyUnitAssoc, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'property_unit_assoc_id' })
    propertyUnit: PropertyUnitAssoc;

    @Column({ name: 'property_unit_assoc_id', type: 'uuid' })
    propertyUnitAssocId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({
        type: 'enum',
        enum: PropertyAssignmentType,
    })
    assignmentType: PropertyAssignmentType;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    dateFrom: Date;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    dateTo: Date;

    @Column({ type: 'text', nullable: true })
    notes: string | null;
}
