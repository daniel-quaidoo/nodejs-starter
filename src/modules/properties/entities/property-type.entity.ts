import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { Property } from './property.entity';

@Entity('property_type')
export class PropertyType extends BaseModel {
    @PrimaryGeneratedColumn()
    propertyTypeId: number;

    @Column({ type: 'varchar', length: 128 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string;

    @OneToMany(() => Property, property => property.propertyType)
    properties: Property[];
}
