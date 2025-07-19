
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ unique: true })
    alias: string;

    @Column('int')
    priority: number

    @Column('text')
    description: string;

    @Column('int')
    land_size: number

    @Column({length: 50})
    locality: string;

    @Column({type: 'boolean', default: false})
    stage: boolean

    @Column('int')
    duration: number

    @Column('decimal', { precision: 10, scale: 2 } )
    cost: number

    @Column('varchar')
    region: string;

    @ManyToMany(() => Category, category => category.services, { cascade: true })
    @JoinTable({
        name: 'service_category', 
        joinColumn: { name: 'service_id', referencedColumnName: 'alias' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'alias' },
    })
    categories: Category[];

    @CreateDateColumn()
    created_at: Date;
    
    @UpdateDateColumn()
    updated_at: Date;

}
