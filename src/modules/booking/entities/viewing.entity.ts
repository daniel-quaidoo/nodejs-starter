import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { User } from '../../auth/users/entities/user.entity';
import { Contact } from '../../auth/contacts/entities/contact.entity';
import { PropertyUnitAssoc } from '../../properties/property/entities/property-unit-assoc.entity';

// enum
import { ViewingType, ViewingStatus } from '../../../shared/booking/enums/booking.enum';

@Entity('viewings')
export class Viewing extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    viewingsId: string;

    @ManyToOne(() => Contact)
    @JoinColumn({ name: 'contact_id' })
    contact: Contact;

    @Column({ name: 'contact_id' })
    contactId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'employee_id' })
    employee: User;

    @Column({ name: 'employee_id' })
    employeeId: string;

    @ManyToOne(() => PropertyUnitAssoc)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    propertyUnit: PropertyUnitAssoc;

    @Column({ name: 'property_unit_assoc_id' })
    propertyUnitAssocId: string;

    @Column({ type: 'timestamptz' })
    contactTime: Date;

    @Column({ type: 'text', nullable: true })
    contactDetails: string | null;

    @Column({ length: 255 })
    viewerName: string;

    @Column({ length: 255 })
    viewerEmail: string;

    @Column({ length: 50 })
    viewerPhoneNumber: string;

    @Column({
        type: 'enum',
        enum: ViewingType,
        default: ViewingType.IN_PERSON,
    })
    viewingType: ViewingType;

    @Column({
        type: 'enum',
        enum: ViewingStatus,
        default: ViewingStatus.INCOMING,
    })
    status: ViewingStatus;
}
