import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, Index } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { User } from '../../auth/users/entities/user.entity';

// enum
import {
    TicketCategoryEnum,
    TicketPriorityEnum,
    TicketRequestTypeEnum,
    TicketSiteTypeEnum,
    TicketStatusEnum,
} from '../../../shared/ticketing/enums/ticketing.enum';

@Entity('tickets')
@Index('IDX_TICKET_CASE_NUMBER', ['caseNumber'], { unique: true })
export class Ticket extends BaseModel {
    @PrimaryColumn({ type: 'varchar', length: 20, name: 'case_number' })
    caseNumber: string;

    @Column({ type: 'varchar', length: 128 })
    organization: string;

    @Column({ type: 'varchar', length: 128 })
    location: string;

    @Column({
        type: 'enum',
        enum: TicketCategoryEnum,
        default: TicketCategoryEnum.GRG,
    })
    category: TicketCategoryEnum;

    @Column({ type: 'varchar', length: 128 })
    description: string;

    @Column({ type: 'varchar', length: 10 })
    code: string;

    @Column({
        type: 'enum',
        enum: TicketSiteTypeEnum,
        default: TicketSiteTypeEnum.BRANCH,
        name: 'site_type',
    })
    siteType: TicketSiteTypeEnum;

    @Column({
        type: 'enum',
        enum: TicketPriorityEnum,
        default: TicketPriorityEnum.LOW,
    })
    priority: TicketPriorityEnum;

    @Column({ type: 'varchar', length: 80, name: 'contact_name' })
    contactName: string;

    @Column({ type: 'varchar', length: 80, name: 'contact_phone' })
    contactPhone: string;

    @Column({ type: 'varchar', length: 80, name: 'requester_name' })
    requesterName: string;

    @Column({ type: 'varchar', name: 'requester_email' })
    requesterEmail: string;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'assigned_to' })
    assignedTo: User | null;

    @Column({ type: 'uuid', name: 'assigned_to', nullable: true })
    assignedToId: string | null;

    @Column({
        type: 'enum',
        enum: TicketRequestTypeEnum,
        name: 'request_type',
    })
    requestType: TicketRequestTypeEnum;

    @Column({
        type: 'enum',
        enum: TicketStatusEnum,
    })
    status: TicketStatusEnum;
}
