import {
    Column,
    CreateDateColumn,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

// entity
import { UserGroup } from './user-group.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('groups')
export class Group {
    @PrimaryGeneratedColumn('uuid')
    group_id: string;

    @Column({ length: 80 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(() => UserGroup, userGroup => userGroup.group)
    userGroups: UserGroup[];

    @ManyToMany(() => Permission, permission => permission.groups)
    @JoinTable({
        name: 'group_permissions',
        joinColumn: { name: 'group_id', referencedColumnName: 'group_id' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'permission_id' },
    })
    permissions: Permission[];
}
