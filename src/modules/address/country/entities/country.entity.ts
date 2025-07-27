import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseModel } from '../../../../core/common/entities/base.entity';
import { Region } from '../../region/entities/region.entity';

@Entity('country')
export class Country extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    country_id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    country_name: string;

    @OneToMany(() => Region, region => region.country)
    regions: Region[];
}
