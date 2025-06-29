import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';

@Entity('unit_type')
export class UnitType extends BaseModel {
    @PrimaryGeneratedColumn()
    unitTypeId: number;

    @Column({ type: 'varchar', length: 128 })
    unitTypeName: string;
}
