import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';;


import { PaymentStatusEnum } from '@lib/contracts/billing/enums/payment-status.enum'; 
import { Service } from '../../service/entities/service.entity';
import { User } from '../../../auth/users/entities/user.entity';
import { Media } from '../../../resources/entities/media.entity';
import { AccountTypeEnum } from '@lib/contracts/job_requests/enums/account-type.enum';
import { JobStatusEnum } from '@lib/contracts/job_requests/enums/job-status.enum';
import { ActiveStatusEnum } from '@lib/contracts/job_requests/enums/active-status.enum';
import { IdentificationTypeEnum } from '@lib/contracts/job_requests/enums/id-type.enum';
import { Address } from '../../../address/entities/address.entity';
import { Contact } from '../../../auth/contacts/entities/contact.entity';

@Entity('job_request')
export class JobRequest {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Service)
    service: Service;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({type: 'varchar' , length: 100 })
    client_name: string;

    @Column({unique: true, type: "varchar", length: 80})
    email: string;

    @Column({type: "varchar", length: 50})
    phone_number: string;

    @Column({type: "varchar", length: 50, nullable: true})
    mobile_number: string;

    @ManyToMany(() => Address, { cascade: true })
    mailing_address: Address;

    @ManyToMany(() => Address, { cascade: true })
    residential_address: Address;

    @Column({ type: 'enum', enum: IdentificationTypeEnum,})
    id_type: IdentificationTypeEnum;

    //when i have the media service
    @Column({ unique: true })
    id_number: string;

    @ManyToOne(() => Media)
    id_document: Media;

    @Column({ unique: true })
    tin_number: string;

    @ManyToOne(() => Media)
    tin_document: Media;

    @ManyToOne(() => Contact)
    @JoinColumn({ name: 'contact_id' })
    contact: Contact;

    @Column('int', { default: 0 })
    progress: number;

    setProgress(value: number) {
        if (value < 0 || value > 100) {
            throw new Error('Progress must be between 0 and 100');
        }
        this.progress = value;
    }

    @Column()
    land_type: string;

    @Column()
    interest_type: string;

    @Column('int')
    duration: number;

    @Column('decimal', { precision: 10, scale: 2 })
    cost: number;

    @Column({type: 'enum', enum: JobStatusEnum, default: JobStatusEnum.NEW})
    status: JobStatusEnum;

    @Column({type: 'enum', enum: ActiveStatusEnum, default: ActiveStatusEnum.ACTIVE})
    active_status: ActiveStatusEnum;

    @Column({type: 'enum', enum: AccountTypeEnum, })
    account_type: AccountTypeEnum;

    @Column({type: 'enum',  enum: PaymentStatusEnum })
    payment_status: PaymentStatusEnum;


}


