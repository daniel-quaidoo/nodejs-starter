import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { User } from '../../users/entities/user.entity';

@Entity('contacts')
export class Contact {
    @PrimaryGeneratedColumn('uuid')
    contactId: string;

    @ManyToOne(() => User, user => user.contacts, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user: User | null;

    @Column({ length: 128 })
    firstName: string;

    @Column({ length: 128 })
    lastName: string;

    @Column({ length: 128 })
    email: string;

    @Column({ length: 128 })
    relation: string;

    //add ooccupation
    @Column({ length: 128, nullable: true })
    occupation: string;

    @Column({ length: 128 })
    phoneNumber: string;

    @Column({ default: false })
    isEmergencyContact: boolean;
}
