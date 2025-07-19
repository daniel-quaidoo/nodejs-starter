
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from '../../service/entities/service.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    alias: string;

    @Column('text')
    description: string;

    @ManyToMany(() => Service, service => service.categories)
    // @JoinTable({name: 'service_categories'})
    services: Service[];
}
