import { Column, Entity, Index, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Property } from './property.entity';

@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    mediaId: string;

    @Column({ length: 255 })
    mediaName: string;

    @Column({ length: 128 })
    mediaType: string;

    @Column({ length: 255 })
    contentUrl: string;

    @Column({ type: 'boolean', default: false })
    isThumbnail: boolean;

    @Column({ type: 'text', nullable: true })
    caption: string | null;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @ManyToOne(() => Property, property => property.media)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    property: Property;
}
