
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";

//enums
import { TicketCategoryEnum } from "@lib/contracts/ticketing/enums/category.enum";
import { TicketPriorityEnum } from "@lib/contracts/ticketing/enums/priority.enum";
import { TicketSiteTypeEnum } from "@lib/contracts/ticketing/enums/site-type.enum";
import { TicketRequestTypeEnum } from "@lib/contracts/ticketing/enums/request-type.enum";
import { TicketStatusEnum } from "@lib/contracts/ticketing/enums/status.enum";


//entity
import { User } from "../../auth/users/entities/user.entity";

@Entity('tickets')
export class Ticket {
  @PrimaryColumn({ type: 'varchar', length: 20 })
  case_number: string;

  @Column({ type: 'varchar', length: 128 })
  organization: string;

  @Column({ type: 'varchar', length: 128 })
  location: string;

  @Column({
    type: 'enum',
    enum: TicketCategoryEnum,
    default: TicketCategoryEnum.GRG,
  })
  category: TicketCategoryEnum;

  @Column({ type: 'varchar', length: 128 })
  description: string;

  @Column({ type: 'varchar', length: 10 })
  code: string;

  @Column({
    type: 'enum',
    enum: TicketSiteTypeEnum,
    default: TicketSiteTypeEnum.BRANCH,
  })
  site_type: TicketSiteTypeEnum;

  @Column({
    type: 'enum',
    enum: TicketPriorityEnum,
    default: TicketPriorityEnum.LOW,
  })
  priority: TicketPriorityEnum;

  @Column({ type: 'varchar', length: 80 })
  contact_name: string;

  @Column({ type: 'varchar', length: 80 })
  contact_phone: string;

  @Column()
  requester_name: string;

  @Column()
  requester_email: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assigned_to' })
  assigned_to: User;

  @Column({
    type: 'enum',
    enum: TicketRequestTypeEnum,
  })
  request_type: TicketRequestTypeEnum;

  @Column({
    type: 'enum',
    enum: TicketStatusEnum,
  })
  status: TicketStatusEnum;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}

