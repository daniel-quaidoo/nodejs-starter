import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    Column,
    JoinColumn,
    Unique,
} from 'typeorm';

// entity
import { Group } from './group.entity';
import { User } from '../../users/entities/user.entity';

@Entity('user_group')
@Unique(['user', 'group'])
export class UserGroup {
    @PrimaryGeneratedColumn('uuid')
    user_group_id: string;

    @ManyToOne(() => User, user => user.userGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Group, group => group.userGroups, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'group_id' })
    group: Group;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
