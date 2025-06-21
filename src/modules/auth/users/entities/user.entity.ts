import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, JoinColumn, OneToOne } from "typeorm";

// enum
import { Gender } from "../../../../shared/auth/users/enums/gender.enum";

// entity
import { BaseModel } from "../../../../core/common";
import { Role } from "../../roles/entities/role.entity";
import { UserCredentials } from "./user-credentials.entity";
import { Contact } from "../../contacts/entities/contact.entity";
// import { Media } from "../../../resources/entities/media.entity";
import { UserGroup } from "../../groups/entities/user-group.entity";
// import { Subscription } from "../../../billing/subscription/entities/subscription.entity";

@Entity({ name: "user" })
export class User extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column({ type: "varchar", length: 128 })
    firstName: string;

    @Column({ type: "varchar", length: 128 })
    lastName: string;

    @Column({ unique: true, type: "varchar", length: 80 })
    email: string;

    @Column({ type: "varchar", length: 50 })
    phoneNumber: string;

    @Column({ type: "varchar", length: 80 })
    identificationNumber: string;

    @Column({ type: "varchar", length: 128 })
    photoUrl: string;

    @Column({ type: "enum", enum: Gender })
    gender: Gender;

    @Column({ type: "date" })
    dateOfBirth: Date;

    @Column({ type: "boolean" })
    isActive: boolean;

    @ManyToMany(() => Role, (role) => role.users)
    @JoinTable({ name: 'user_roles' })
    roles: Role[]

    @OneToMany(() => UserGroup, (userGroup) => userGroup.user)
    userGroups: UserGroup[];

    @OneToMany(() => Contact, (contact) => contact.user)
    contacts: Contact[];

    // @OneToMany(()=> Media, (media)  => media.uploaded_by)
    // media: Media[]

    @OneToOne(() => UserCredentials, { cascade: true })
    @JoinColumn({ name: 'credentials_id' })
    credentials: UserCredentials;

    // @OneToMany(() => Subscription, (subscription) => subscription.user)
    // subscriptions: Subscription[];
}
