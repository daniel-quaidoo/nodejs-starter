

import {
    Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne,
  } from 'typeorm';

//entity
import { User } from '../../auth/users/entities/user.entity';
 

//enum
import { DocumentEntityTypeEnum } from '@lib/contracts/resources/enums/document-type.enum';
import { MediaTypeEnum } from '@lib/contracts/resources/enums/media-type.enum';
  
@Entity('media')
export class Media {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ length: 150, nullable: true })
    description: string;
  
    @Column()
    content_url: string;
  
    @Column({ type: 'enum', enum: MediaTypeEnum })
    media_type: MediaTypeEnum;
  
    @Column({type: 'varchar', unique:true})
    media_alias: string;
  
    @Column()
    entity_id: string;
  
    @Column({ type: 'enum', enum: DocumentEntityTypeEnum })
    entity_type: DocumentEntityTypeEnum;
  
    @ManyToOne(() => User, user => user.media)
    uploaded_by: User;
  
    @CreateDateColumn()
    uploaded_at: Date;
}
  