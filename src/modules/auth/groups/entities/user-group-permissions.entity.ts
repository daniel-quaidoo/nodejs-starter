import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from "typeorm";

// entity
import { Group } from "./group.entity";
import { User } from "../../users/entities/user.entity";
import { Permission } from "../../permissions/entities/permission.entity";

@Entity("user_group_permissions")
@Unique(["user", "group", "permission"]) // prevent duplicate entries
export class UserGroupPermission {
  @PrimaryGeneratedColumn("uuid")
  user_group_permission_id: string;

  @ManyToOne(() => User, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Group, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "group_id" })
  group: Group;

  @ManyToOne(() => Permission, { eager: true, onDelete: "CASCADE" })
  @JoinColumn({ name: "permission_id" })
  permission: Permission;

  // Who granted the permission (admin or system user)
  @ManyToOne(() => User, { eager: true, nullable: true })
  @JoinColumn({ name: "granted_by" })
  granted_by: User;

  // Reason or justification for permission
  @Column({ type: "text", nullable: true })
  granted_reason?: string;

  // Optional expiry timestamp for temporary permissions
  @Column({ type: "timestamp with time zone", nullable: true })
  expires_at?: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
