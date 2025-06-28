import { Entity, Column, ManyToOne, JoinColumn, Index, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { Contract } from './contract.entity';
import { BaseModel } from '../../../core/common';
import { User } from '../../auth/users/entities/user.entity';
import { Contact } from '../../auth/contacts/entities/contact.entity';

// enum
import {
    ContractEntityType,
    ContractAssignmentStatus,
} from '../../../shared/contract/enums/contract.enum';

@Entity('contract_assignment')
@Index('IDX_CONTRACT_ASSIGNMENT_ENTITY', ['entityId', 'entityType'])
@Index('IDX_CONTRACT_ASSIGNMENT_CONTRACT', ['contractNumber'])
export class ContractAssignment extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    contractAssignmentId: string;

    @Column('uuid')
    entityId: string;

    @Column({
        type: 'enum',
        enum: ContractEntityType,
    })
    entityType: ContractEntityType;

    @ManyToOne(() => Contract, { eager: true })
    @JoinColumn({ name: 'contract_number', referencedColumnName: 'contractNumber' })
    contract: Contract;

    @Column({ type: 'text', nullable: true, length: 128 })
    contractNumber: string;

    @ManyToOne(() => Contact, { nullable: true })
    @JoinColumn({ name: 'client_id' })
    client: Contact | null;

    @Column('uuid', { nullable: true })
    clientId: string | null;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'employee_id' })
    employee: User | null;

    @Column('uuid', { nullable: true })
    employeeId: string | null;

    @Column({
        type: 'enum',
        enum: ContractAssignmentStatus,
        default: ContractAssignmentStatus.PENDING,
    })
    status: ContractAssignmentStatus;

    @Column({ type: 'timestamptz' })
    startDate: Date;

    @Column({ type: 'timestamptz' })
    endDate: Date;

    @Column({ type: 'timestamptz', nullable: true })
    nextPaymentDue: Date | null;

    @Column({ type: 'timestamptz', nullable: true })
    terminatedAt: Date | null;

    @Column({ type: 'text', nullable: true })
    terminationReason: string | null;
}
