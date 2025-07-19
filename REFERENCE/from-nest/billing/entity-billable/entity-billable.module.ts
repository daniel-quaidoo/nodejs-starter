import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EntityBillable } from "./entity/entity-billable.entity";
import { PaymentType } from "../payment/entities/payment-type.entity";
import { EntityBillableController } from "./entity-billable.controller";
import { EntityBillableService } from "./entity-billable.service";
import { Invoice } from "../invoice/entities/invoice.entity";


@Module({
    imports: [TypeOrmModule.forFeature([EntityBillable, PaymentType, Invoice])],
    controllers: [EntityBillableController],
    providers: [EntityBillableService],
    exports: [EntityBillableService],
  })
  export class EntityBillableModule {}
  