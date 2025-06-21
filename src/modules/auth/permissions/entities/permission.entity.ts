import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { Role } from '../../roles/entities/role.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity({ name: 'permission' })
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    permission_id: string;

    @Column({ type: 'varchar', length: 80, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 80 })
    alias: string;

    @Column({ type: 'text' })
    description: string;

    @ManyToMany(() => Role, role => role.permissions)
    roles: Role[];

    @ManyToMany(() => Group, group => group.permissions)
    groups: Group[];
}
