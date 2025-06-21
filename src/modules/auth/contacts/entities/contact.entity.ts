import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

// entity
import { User } from "../../users/entities/user.entity";


@Entity('contacts')
export class Contact{
    @PrimaryGeneratedColumn('uuid')
    contactId: String;

    @ManyToOne(() => User, (user) => user.contacts, { nullable: true })
    @JoinColumn({name: 'user_id'})
    user: User | null;
    
    @Column({ length: 128 })
    firstName: String;

    @Column({ length: 128 })
    lastName: String;

    @Column({ length: 128 })
    email: String;

    @Column({ length: 128 })
    relation: String;

    //add ooccupation
    @Column({ length: 128, nullable: true })
    occupation: String; 

    @Column({ length: 128 })
    phoneNumber: String;

    @Column({ default: false })
    isEmergencyContact: boolean;
}