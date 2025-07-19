import { BadRequestException, Injectable } from "@nestjs/common";
import { DeepPartial, In, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

//entity
import { Invoice } from '../entities/invoice.entity';
import { InvoiceItem } from '../entities/invoice-item.entity';
import { User } from "../../../auth/users/entities/user.entity";
import { Transaction } from "../../transaction/entities/transaction.entity";

//dto
import { CreateInvoiceDto } from "@lib/contracts/billing/invoice/create-invoice.dto";
import { UpdateInvoiceDto } from "@lib/contracts/billing/invoice/update-invoice.dto";
import { PageOptionsDto } from "@app/common/dto/page-meta/page-optional.dto";
import { PageDto } from "@app/common/dto/page.dto";

//utils & enums
import { generateInvoiceId } from "../../utils/invoice-id.utils";
import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { paginate } from "@app/common/utils/paginate";
import { EntityBillable } from "../../entity-billable/entity/entity-billable.entity";
import { EntityBillableService } from "../../entity-billable/entity-billable.service";

@Injectable()
export class InvoiceService{
    constructor(
        @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>,
        @InjectRepository(User) private userRepo: Repository<User>,
        @InjectRepository(InvoiceItem) private invoiceItemRepo: Repository<InvoiceItem>,
        @InjectRepository(Transaction) private transRepo: Repository<Transaction>,
        private readonly entityBillableService: EntityBillableService,
    ){}

    async createInvoice(dto: CreateInvoiceDto): Promise<Invoice>{
        
        const issuedByUser = await this.userRepo.findOneOrFail({ where: { user_id: dto.issued_by } });
        const issuedToUser = await this.userRepo.findOneOrFail({ where: { user_id: dto.issued_to } });

        const items = dto.item_ids
            ? await this.invoiceItemRepo.findBy({invoice_item_id: In(dto.item_ids)})
            : [];

        const transactions = dto.transaction_ids
            ? await this.transRepo.findBy({transaction_id: In(dto.transaction_ids)})
            : [];

        const invoice = this.invoiceRepo.create({
            invoice_id: generateInvoiceId(),
            invoice_details: dto.invoice_details,
            invoice_amount: dto.invoice_amount,
            due_date: dto.due_date,
            date_paid: dto.date_paid,
            invoice_type: dto.invoice_type,
            status: dto.status,
            issued_by: issuedByUser,
            issued_to: issuedToUser,
            items,
            transactions,
        });

        const savedInvoice = await this.invoiceRepo.save(invoice);
        await this.entityBillableService.syncFromInvoice(savedInvoice);

        return savedInvoice;

    }

    async findOne(invoiceId:string): Promise<Invoice>{
        return this.invoiceRepo.findOneOrFail({
            where: {invoice_id: invoiceId},
            relations: [ 'items', 'transactions']
        })
    }

    async findAllPaginated(pageOptionsDto: PageOptionsDto): Promise<PageDto<Invoice>> {
        return paginate(this.invoiceRepo, pageOptionsDto, {
            relations: ['items', 'transactions'],
        });
    }

    async findAllByStatusPaginated(status: PaymentStatusEnum,pageOptionsDto: PageOptionsDto,): Promise<PageDto<Invoice>> {
        const allowedOrderFields = ['date_paid', 'invoice_amount', 'due_date', 'status'];


        if (!allowedOrderFields.includes(pageOptionsDto.orderBy)) {
            throw new BadRequestException(`Invalid orderBy: ${pageOptionsDto.orderBy}`);
        }

        return paginate(this.invoiceRepo, pageOptionsDto, {
            where: { status },
            relations: ['items', 'transactions'],
        });
    }
    

    async updateInvoice(invoiceId: string, dto: UpdateInvoiceDto): Promise<Invoice> {

        let issuedByUser = undefined;

        if (dto.issued_by) {
            issuedByUser = await this.userRepo.findOneOrFail({ where: { user_id: dto.issued_by } });
        }
    
        let issuedToUser = undefined;

        if (dto.issued_to) {
            issuedToUser = await this.userRepo.findOneOrFail({ where: { user_id: dto.issued_to } });
        }

        let items = undefined, transactions = undefined;

        if (dto.item_ids){
            items = await this.invoiceItemRepo.findBy({invoice_item_id: In(dto.item_ids)});
        }

        if (dto.transaction_ids){
            transactions = await this.transRepo.findBy({transaction_id: In(dto.transaction_ids)});
        }
    
        const updateData: DeepPartial<Invoice> = {
            ...dto,
            issued_by: issuedByUser,
            issued_to: issuedToUser,
            ...(items ? {items}: {}),
            ...(transactions ? {transactions}: {}),
        };
    
        await this.invoiceRepo.update({ invoice_id: invoiceId }, updateData);
        
        const updatedInvoice = await this.findOne(invoiceId);

        await this.entityBillableService.syncFromUpdatedInvoice(updatedInvoice);

        return updatedInvoice
    }

    async updateStatusAndDatePaid(invoiceId: string, status: PaymentStatusEnum, datePaid: Date): Promise<Invoice>{
        await this.invoiceRepo.update(
            {invoice_id: invoiceId}, 
            {status,
            date_paid: datePaid});
        return this.findOne(invoiceId);
    }

    async delete(invoiceId:string): Promise<void>{
        await this.invoiceRepo.delete({invoice_id: invoiceId})
    }
}