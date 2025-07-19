import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Region } from '../../region/entities/region.entity';

@Entity('country')
export class Country {
    @PrimaryGeneratedColumn('uuid')
    country_id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    country_name: string;

    @OneToMany(() => Region, (region) => region.country)
    regions: Region[];
}