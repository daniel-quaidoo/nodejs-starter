import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
// JoinTable, ManyToMany, TODO: add to typeorm after implementing service entit

// base model
import { BaseModel } from '../../../../core/common';
// import { Service } from '../../service/entities/service.entity';

@Entity('category')
export class Category extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    alias: string;

    @Column('text')
    description: string;

    // TODO: Add service entitiy
    // @ManyToMany(() => Service, service => service.categories)
    // // @JoinTable({name: 'service_categories'})
    // services: Service[];
}
