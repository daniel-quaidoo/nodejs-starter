import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn, Column } from 'typeorm';

// entity
import { Group } from './group.entity';
import { BaseModel } from '../../../../core/common';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('user_group_permissions')
@Unique(['user', 'group', 'permission']) // prevent duplicate entries
export class UserGroupPermission extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    userGroupPermissionId: string;

    @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @ManyToOne(() => Permission, { eager: true, onDelete: 'CASCADE' })
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

    // Who granted the permission (admin or system user)
    @ManyToOne(() => User, { eager: true, nullable: true })
    @JoinColumn({ name: 'granted_by' })
    grantedBy: User;

    // Reason or justification for permission
    @Column({ type: 'text', nullable: true })
    grantedReason?: string;

    // Optional expiry timestamp for temporary permissions
    @Column({ type: 'timestamp with time zone', nullable: true })
    expiresAt?: Date;
}
