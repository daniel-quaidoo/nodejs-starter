import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { Contact } from '../../auth/contacts/entities/contact.entity';
import { PropertyUnitAssoc } from '../../properties/entities/property-unit-assoc.entity';

// enum
import { ReservationStatus } from '../../../shared/booking/enums/booking.enum';

@Entity('reservations')
export class Reservation extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    reservationId: string;

    @ManyToOne(() => Contact)
    @JoinColumn({ name: 'reserved_by' })
    reservedBy: Contact;

    @Column({ name: 'reserved_by' })
    reservedById: string;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    reservedAt: Date;

    @Column({ type: 'timestamptz' })
    checkIn: Date;

    @Column({ type: 'timestamptz' })
    checkOut: Date;

    @ManyToOne(() => PropertyUnitAssoc)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    propertyUnit: PropertyUnitAssoc;

    @Column({ name: 'property_unit_assoc_id' })
    propertyUnitAssocId: string;

    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING,
    })
    status: ReservationStatus;

    @Column({ type: 'text', nullable: true })
    reservationNote: string | null;
}
