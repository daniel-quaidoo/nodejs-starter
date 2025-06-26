import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, Unique } from 'typeorm';

// entity
import { Group } from './group.entity';
import { BaseModel } from '../../../../core/common';
import { User } from '../../users/entities/user.entity';

@Entity('user_group')
@Unique(['user', 'group'])
export class UserGroup extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    userGroupId: string;

    @ManyToOne(() => User, user => user.userGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, group => group.userGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column({ default: true })
    isActive: boolean;
}
