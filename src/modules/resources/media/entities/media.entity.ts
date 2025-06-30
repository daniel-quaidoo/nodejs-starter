import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';

// entity
import { BaseModel } from '../../../../core/common';
import { User } from '../../../auth/users/entities/user.entity';
import { Property } from '../../../properties/property/entities/property.entity';

// enum
import { MediaTypeEnum } from '../../../../shared/media/enums/media.enum';
import { EntityMediaTypeEnum } from '../../../../shared/media/enums/media.enum';

@Entity('media')
@Index('IDX_MEDIA_ENTITY', ['entityId', 'entityType'])
export class Media extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    mediaId: string;

    @Column({ length: 100 })
    mediaName: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', name: 'content_url' })
    contentUrl: string;

    @Column({
        type: 'enum',
        enum: MediaTypeEnum,
        name: 'media_type',
    })
    mediaType: MediaTypeEnum;

    @Column({ type: 'boolean', default: false })
    isThumbnail: boolean;

    @Column({ type: 'varchar', name: 'caption' })
    caption: string | null;

    @Column({
        type: 'varchar',
        unique: true,
        name: 'media_alias',
    })
    mediaAlias: string;

    @Column({ type: 'uuid', name: 'entity_id' })
    entityId: string;

    @Column({
        type: 'enum',
        enum: EntityMediaTypeEnum,
        name: 'entity_type',
    })
    entityType: EntityMediaTypeEnum;

    @ManyToOne(() => User, user => user.media)
    @JoinColumn({ name: 'uploaded_by' })
    uploadedBy: User;

    @Column({ type: 'uuid', name: 'uploaded_by', nullable: true })
    uploadedById: string | null;

    @CreateDateColumn({ name: 'uploaded_at' })
    uploadedAt: Date;

    @ManyToOne(() => Property, property => property.media)
    @JoinColumn({ name: 'property_unit_assoc_id' })
    property: Property;
}
