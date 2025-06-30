import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { EntityAmenities } from './entity-amenities.entity';

@Entity('amenities')
export class Amenity {
    @PrimaryGeneratedColumn('uuid')
    amenityId: string;

    @Column({ length: 128 })
    amenityName: string;

    @Column({ length: 128 })
    amenityShortName: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => EntityAmenities, entityAmenities => entityAmenities.amenity)
    properties: EntityAmenities[];
}
