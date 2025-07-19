import { BillableTypeEnum } from "@lib/contracts/billing/enums/billable-type.enum";
import { EntityTypeEnum } from "@lib/contracts/billing/enums/entity-type.enum";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentType } from "../../payment/entities/payment-type.entity";



@Entity('entity_billable')
export class EntityBillable {
  @PrimaryGeneratedColumn('uuid')
  entity_billable_id: string;

  @Column({ type: 'uuid' })
  entity_id: string;

  @Column({ type: 'enum', enum: EntityTypeEnum })
  entity_type: EntityTypeEnum;

  @Column({ type: 'varchar' })
  billable_id: string;

  @Column({ type: 'enum', enum: BillableTypeEnum })
  billable_type: BillableTypeEnum;

  @Column({ type: 'timestamp', nullable: true })
  start_period: Date;

  @Column({ type: 'timestamp', nullable: true })
  end_period: Date;
}