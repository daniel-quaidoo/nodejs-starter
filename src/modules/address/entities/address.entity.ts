import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseModel } from '../../../core/common/entities/base.entity';
import { City } from '../city/entities/city.entity';
import { Region } from '../region/entities/region.entity';
import { Country } from '../country/entities/country.entity';
import { AddressType } from '../enums/address-type.enum';

@Entity('address')
export class Address extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    address_id: string;

    @Column({ type: 'enum', enum: AddressType })
    address_type: AddressType;

    @Column({ default: false })
    primary: boolean;

    @Column({ type: 'varchar', length: 128 })
    address_1: string;

    @Column({ type: 'varchar', length: 128, nullable: true })
    address_2: string;

    @Column({ type: 'varchar', length: 20 })
    address_postal_code: string;

    @ManyToOne(() => City, { eager: true })
    @JoinColumn({ name: 'city_id' })
    city: City;

    @ManyToOne(() => Region, { eager: true })
    @JoinColumn({ name: 'region_id' })
    region: Region;

    @ManyToOne(() => Country, { eager: true })
    @JoinColumn({ name: 'country_id' })
    country: Country;
}
