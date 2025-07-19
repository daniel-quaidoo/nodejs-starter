import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

//entity
import { Country } from '../../country/entities/country.entity';

@Entity('region')
@Unique(['region_name', 'country'])
export class Region {
    @PrimaryGeneratedColumn('uuid')
    region_id: string;

    @Column({ type: 'varchar', length: 255})
    region_name: string;

    @ManyToOne(() => Country, (country) => country.regions, { eager: true })
    @JoinColumn({name: 'country_id'})
    country: Country;

}