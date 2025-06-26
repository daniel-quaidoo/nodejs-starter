import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { UserGroup } from './user-group.entity';
import { BaseModel } from '../../../../core/common';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('groups')
export class Group extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    groupId: string;

    @Column({ length: 80 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => UserGroup, userGroup => userGroup.group)
    userGroups: UserGroup[];

    @ManyToMany(() => Permission, permission => permission.groups)
    @JoinTable({
        name: 'group_permissions',
        joinColumn: { name: 'group_id', referencedColumnName: 'groupId' },
        inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'permissionId' },
    })
    permissions: Permission[];
}
