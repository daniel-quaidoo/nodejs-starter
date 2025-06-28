import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';

@Entity('contract_type')
export class ContractType extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    contractTypeId: string;

    @Column({ length: 50 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;
}
