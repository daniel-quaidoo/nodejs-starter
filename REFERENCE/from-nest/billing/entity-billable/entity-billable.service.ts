import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEntityBillableDto } from './dto/create-entity-billable.dto';
import { PaymentType } from '../payment/entities/payment-type.entity';
import { EntityBillable } from './entity/entity-billable.entity';
import { EntityTypeEnum } from '@lib/contracts/billing/enums/entity-type.enum';
import { Invoice } from '../invoice/entities/invoice.entity';
import { BillableTypeEnum } from '@lib/contracts/billing/enums/billable-type.enum';


@Injectable()
export class EntityBillableService {
  constructor(
    @InjectRepository(EntityBillable)
    private readonly billableRepo: Repository<EntityBillable>,
    @InjectRepository(PaymentType)
    private readonly paymentTypeRepo: Repository<PaymentType>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
  ) {}

  async create(dto: CreateEntityBillableDto): Promise<EntityBillable> {

    const billable = this.billableRepo.create({
      ...dto,
    });

    return this.billableRepo.save(billable);
  }

  async findByEntity(entityId: string, type: EntityTypeEnum): Promise<EntityBillable[]> {
    return this.billableRepo.find({
      where: {
        entity_id: entityId,
        entity_type: type,
      },
      relations: ['payment_type'],
    });
  }

  async findInvoicesLinkedToEntity(entity_id: string, entity_type: EntityTypeEnum, billable_type: BillableTypeEnum, billable_id: string): Promise<Invoice[]> {
    // Validate entity_type and billable_type
    if (entity_type !== EntityTypeEnum.USER || billable_type !== BillableTypeEnum.Invoice) {
      throw new BadRequestException('Unsupported entity_type or billable_type');
    }
  
    // Load invoice
    const invoice = await this.invoiceRepo.findOne({
      where: { invoice_id: billable_id },
      relations: ['issued_to'],
    });
  
    if (!invoice) throw new NotFoundException('Invoice not found');
  
    // Confirm issued_to matches entity_id
    if (invoice.issued_to.user_id !== entity_id) {
      throw new ForbiddenException('Invoice is not linked to the provided entity_id');
    }
  
    // Find all invoices issued to this entity and matching invoice_id
    const matchingInvoices = await this.invoiceRepo.find({
      where: {
        issued_to: { user_id: entity_id },
        invoice_id: billable_id,
      },
      relations: ['issued_to', 'items', 'transactions'],
    });
  
    return matchingInvoices;
  }

 
  async syncFromInvoice(invoice: Invoice) {
    const exists = await this.billableRepo.findOne({
      where: {
        billable_id: invoice.invoice_id,
        billable_type: BillableTypeEnum.Invoice,
      },
    });

    if (exists) return;

      await this.billableRepo.save({
        entity_id: invoice.issued_to.user_id,
        entity_type: EntityTypeEnum.USER,
        billable_id: invoice.invoice_id,
        billable_type: BillableTypeEnum.Invoice,
        start_period: new Date(),

      });
    }


  async syncFromUpdatedInvoice(invoice: Invoice){
    const record = await this.billableRepo.findOne({
      where: {
        billable_id: invoice.invoice_id,
        billable_type: BillableTypeEnum.Invoice,
      },
    });

    if (!record) {
      return this.syncFromInvoice(invoice); 
    }

    record.entity_id = invoice.issued_to.user_id;
    record.entity_type = EntityTypeEnum.USER;
    await this.billableRepo.save(record);
  
  }
  
}





