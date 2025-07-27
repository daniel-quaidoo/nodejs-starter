import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { BaseModel } from '../../../../core/common/entities/base.entity';
import { Region } from '../../region/entities/region.entity';

@Entity('city')
@Unique(['city_name', 'region'])
export class City extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    city_id: string;

    @Column({ type: 'varchar', length: 255 })
    city_name: string;

    @ManyToOne(() => Region, { eager: true })
    @JoinColumn({ name: 'region_id' })
    region: Region;
}
