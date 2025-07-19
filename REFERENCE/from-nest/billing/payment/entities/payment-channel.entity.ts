import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";


@Entity('payment_channel')
export class PaymentChannel{
    @PrimaryGeneratedColumn()
    payment_channel_id: number;

    @Index()
    @Column({unique:true})
    payment_channel_name: string;

    @Column({ type: 'text', nullable: true })
    payment_channel_description: string;

}