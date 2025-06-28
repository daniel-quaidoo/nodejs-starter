import { Entity, Column, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

// entity
import { BaseModel } from '../../../core/common';
import { User } from '../../auth/users/entities/user.entity';

@Index('IDX_RENTAL_HISTORY_USER', ['userId'])
@Index('IDX_RENTAL_HISTORY_DATES', ['startDate', 'endDate'])
@Entity('past_rental_history')
export class PastRentalHistory extends BaseModel {
    @PrimaryGeneratedColumn('uuid')
    rentalHistoryId: string;

    @Column({ type: 'timestamptz' })
    startDate: Date;

    @Column({ type: 'timestamptz' })
    endDate: Date;

    @Column({ nullable: false })
    propertyOwnerName: string;

    @Column({ nullable: false })
    propertyOwnerEmail: string;

    @Column({ nullable: false })
    propertyOwnerMobile: string;

    @ManyToOne(() => User, user => user.pastRentalHistories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', type: 'uuid', nullable: false })
    userId: string;
}
