import { Column, Entity, PrimaryColumn } from 'typeorm';

// model
import { BaseModel } from '../../../core/common';

@Entity('users')
export class User extends BaseModel {
    @PrimaryColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;

    @Column()
    role!: string;
}
