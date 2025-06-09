import { Column, Entity } from "typeorm";

// model
import { BaseModel } from "../../../core/common";

@Entity('users')
export class User extends BaseModel {
    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    role!: string; 
}