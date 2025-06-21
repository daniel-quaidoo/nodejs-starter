import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

// entity
import { BaseModel } from "../../../../core/common";
import { User } from "../../users/entities/user.entity";
import { Permission } from "../../permissions/entities/permission.entity";

@Entity({name: "role"})
export class Role extends BaseModel{
    @PrimaryGeneratedColumn('uuid')
    role_id: string;

    @Column({type: "varchar", length: 80, unique: true})
    name: string;

    @Column({type: "varchar", length: 80})
    alias: string;

    @Column({type: "text"})
    description: string;

    @ManyToMany(() => User, (user) => user.roles)
    users: User[];

    @ManyToMany(() => Permission, (permission) => permission.roles, {cascade: true})
    @JoinTable({name: 'role_permissions'})
    permissions: Permission[]
}