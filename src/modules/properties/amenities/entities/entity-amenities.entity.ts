import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

// entity
import { Amenity } from './amenity.entity';
import { Property } from '../../property/entities/property.entity';

@Entity('entity_amenities')
export class EntityAmenities {
    @PrimaryGeneratedColumn('uuid')
    entityAmenitiesId: string;

    @Column({ type: 'uuid' })
    entityId: string;

    @Column({ length: 128 })
    entityType: string;

    @Column({ type: 'uuid' })
    amenityId: string;

    @ManyToOne(() => Property, property => property.amenities)
    @JoinColumn({ name: 'entity_id' })
    entity: Property;

    @ManyToOne(() => Amenity, amenity => amenity.properties)
    @JoinColumn({ name: 'amenity_id' })
    amenity: Amenity;
}
