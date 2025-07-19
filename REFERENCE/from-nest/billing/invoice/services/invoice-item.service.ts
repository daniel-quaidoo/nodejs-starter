import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { InvoiceItem } from "../entities/invoice-item.entity";
import { Repository } from "typeorm";
import { Invoice } from "../entities/invoice.entity";
import { CreateInvoiceItemDto } from "@lib/contracts/billing/invoice/create-invoice-item.dto";
import { InvoiceItemDto } from "@lib/contracts/billing/invoice/invoice-item.dto";
import { UpdateInvoiceItemDto } from "@lib/contracts/billing/invoice/update-invoice-item.dto";
import { CreateInvoiceItemsDto } from "@lib/contracts/billing/invoice/create-invoice-items.dto";
import { InvoiceItemsPageOptionsDto } from "@lib/contracts/billing/invoice/invoice-items-page-options.dto";
import { PageDto } from "@app/common/dto/page.dto";
import { paginate } from "@app/common/utils/paginate";


@Injectable()
export class InvoiceItemService{
    constructor(
        @InjectRepository(InvoiceItem) private invoiceItemRepo: Repository<InvoiceItem>,
        @InjectRepository(Invoice) private invoiceRepo: Repository<Invoice>
    ){}

    async addItemsToInvoice(invoiceId:string, itemsDto: CreateInvoiceItemsDto): Promise<InvoiceItem[]>{
        const invoice = await this.invoiceRepo.findOneByOrFail({invoice_id: invoiceId})

        const items = itemsDto.items.map((dto)=> 
            this.invoiceItemRepo.create({
                ...dto,
                invoice,
                total_price: parseFloat((dto.unit_price * dto.quantity).toFixed(2)),
        }),
        );

        const savedItems = await this.invoiceItemRepo.save(items);
        await this.recalculateInvoiceAmount(invoiceId);

        return savedItems;
    }

    async getInvoiceItemsPaginated(invoiceId:string, pageOptionsDto:InvoiceItemsPageOptionsDto): Promise<PageDto<InvoiceItem>>{
        const allowedOrderFields = ['total_price', 'quantity'];

        if (!allowedOrderFields.includes(pageOptionsDto.orderBy)) {
            throw new BadRequestException(`Invalid orderBy: ${pageOptionsDto.orderBy}`);
        }

        return paginate(this.invoiceItemRepo, pageOptionsDto, {
            where: {invoice: {invoice_id: invoiceId}}
        });
    }

    async getInvoiceItem(invoiceId: string, itemId: string): Promise<InvoiceItem> {
        
        const invoiceItem = await this.invoiceItemRepo.findOne({
            where: { invoice: { invoice_id: invoiceId }, invoice_item_id: itemId },
        });
    
        if (!invoiceItem) {
            throw new NotFoundException('Invoice item not found or does not belong to the specified invoice');
        }
        return invoiceItem;
    }


    async updateInvoiceItem(invoiceId: string, itemId: string, dto: UpdateInvoiceItemDto): Promise<InvoiceItem> {
        const item = await this.invoiceItemRepo.findOne({
            where: { invoice: { invoice_id: invoiceId }, invoice_item_id: itemId },
        });

        if (!item) {
            throw new NotFoundException('Invoice item not found or does not belong to the specified invoice');
        }

        Object.assign(item, dto);
        if (dto.unit_price || dto.quantity) {
            item.total_price = (dto.unit_price ?? item.unit_price) * (dto.quantity ?? item.quantity);
        }

        const updatedItem = await this.invoiceItemRepo.save(item);
        await this.recalculateInvoiceAmount(invoiceId);

        return updatedItem ;
    }

    async deleteInvoiceItem(invoiceId: string, itemId: string): Promise<void> {
        const item = await this.invoiceItemRepo.findOne({
            where: { invoice: { invoice_id: invoiceId }, invoice_item_id: itemId },
        });
    
        if (!item) {
            throw new NotFoundException('Invoice item not found or does not belong to the specified invoice');
        }

        await this.invoiceItemRepo.delete(itemId)
        await this.recalculateInvoiceAmount(invoiceId);
        
    }
    
    private async recalculateInvoiceAmount(invoiceId: string): Promise<void>{
        const items = await this.invoiceItemRepo.find({
            where: {invoice: {invoice_id: invoiceId}},
        });

        const total = items.reduce((sum, item) => sum + Number(item.total_price), 0);

        await this.invoiceRepo.update(
            {invoice_id: invoiceId},
            {invoice_amount: total}
        );
    }
}