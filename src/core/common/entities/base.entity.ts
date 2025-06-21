import { CreateDateColumn, UpdateDateColumn, DeleteDateColumn, BaseEntity } from 'typeorm';

export abstract class BaseModel extends BaseEntity {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt!: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updatedAt!: Date;

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt?: Date | null;
}

export interface IBaseModel extends BaseModel {
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}
