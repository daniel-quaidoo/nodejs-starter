import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { ContractType } from './contract-type.entity';
// import { Invoice } from '../../invoices/entities/invoice.entity';

// enum
import { ContractStatus } from '../../../shared/contract/enums/contract.enum';

@Entity('contract')
@Index('IDX_CONTRACT_NUMBER', ['contractNumber'], { unique: true })
export class Contract extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    contractId: string;

    @Column({ length: 128, unique: true, nullable: false })
    contractNumber: string;

    @ManyToOne(() => ContractType, { eager: true })
    @JoinColumn({ name: 'contract_type_id' })
    contractType: ContractType;

    @Column({ name: 'contract_type_id' })
    contractTypeId: string;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        default: ContractStatus.DRAFT,
    })
    contractStatus: ContractStatus;

    @Column({ type: 'text' })
    contractDetails: string;

    @Column({ type: 'int', default: 0 })
    paymentFrequency: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    paymentAmount: number;

    @Column({ type: 'decimal', precision: 5, scale: 2 })
    feePercentage: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    feeAmount: number;

    @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
    dateSigned: Date;

    @Column({ type: 'timestamptz' })
    startDate: Date;

    @Column({ type: 'timestamptz' })
    endDate: Date;

    // @OneToMany(() => Invoice, invoice => invoice.contract)
    // invoices: Invoice[];
}
