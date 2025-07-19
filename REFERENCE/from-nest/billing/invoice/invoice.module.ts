import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

//entity
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';

//controllers
import { InvoiceItemController } from './controllers/invoice-item.controller';
import { InvoiceController } from './controllers/invoice.controller';

//services
import { InvoiceItemService } from './services/invoice-item.service';
import { InvoiceService } from './services/invoice.service';
import { UsersModule } from '../../auth/users/users.module';
import { TransactionModule } from '../transaction/transaction.module';
import { EntityBillableModule } from '../entity-billable/entity-billable.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Invoice, InvoiceItem]), 
        UsersModule,
        forwardRef(() => TransactionModule),
        EntityBillableModule,
    ],
    controllers: [InvoiceController, InvoiceItemController],
    providers: [InvoiceService, InvoiceItemService],
    exports: [InvoiceService]
})
export class InvoiceModule {}