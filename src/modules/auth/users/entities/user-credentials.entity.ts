import {
    Entity,
    Column,
    OneToOne,
    PrimaryGeneratedColumn,
} from "typeorm";

// entity
import { User } from "./user.entity";
import { BaseModel } from "../../../../core/common";

@Entity("user_credentials")
export class UserCredentials  extends BaseModel {
    @PrimaryGeneratedColumn("uuid")
    userCredentialsId: string;

    @OneToOne(() => User, (user) => user.credentials)
    user: User;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    loginProvider?: string;

    @Column({ nullable: true })
    verificationToken?: string;

    @Column({ nullable: true })
    resetToken?: string;

    @Column({ nullable: true })
    isSubscribedToken?: string;

    @Column({ default: false })
    isDisabled?: boolean;

    @Column({ default: false })
    isVerified?: boolean;

    @Column({ default: false })
    isSubscribed?: boolean;

    @Column({ default: false })
    isOnboarded?: boolean;

    @Column({ default: false })
    isApproved?: boolean;

    @Column({ default: false })
    isRejected?: boolean;

    @Column({ type: "timestamptz", nullable: true })
    lastLoginTime: Date;

    @Column({ type: "timestamptz", nullable: true })
    currentLoginTime: Date;

}
