import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { EntityBillableService } from './entity-billable.service';
import { CreateEntityBillableDto } from './dto/create-entity-billable.dto';
import { EntityTypeEnum } from '@lib/contracts/billing/enums/entity-type.enum';
import { BillableTypeEnum } from '@lib/contracts/billing/enums/billable-type.enum';



@ApiTags('Entity Billables')
@Controller('entity-billable')

export class EntityBillableController {

    constructor(private readonly billableService: EntityBillableService) {}

    @Post()
    async create(@Body() dto: CreateEntityBillableDto) {
        return this.billableService.create(dto);
    }

    @Get('')
    @ApiQuery({ name: 'entity_id', type: String })
    @ApiQuery({ name: 'entity_type', enum: EntityTypeEnum })
    @ApiQuery({ name: 'billable_type', enum: BillableTypeEnum })
    @ApiQuery({ name: 'billable_id', type: String })
    findLinkedInvoices(
      @Query('entity_id') entityId: string,
      @Query('entity_type') entityType: EntityTypeEnum,
      @Query('billable_type') billableType: BillableTypeEnum,
      @Query('billable_id') billableId: string
    ) {
      return this.billableService.findInvoicesLinkedToEntity(entityId, entityType, billableType, billableId);
    }
    
}
