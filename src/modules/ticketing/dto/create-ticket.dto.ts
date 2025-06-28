import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
    TicketCategoryEnum,
    TicketPriorityEnum,
    TicketRequestTypeEnum,
    TicketSiteTypeEnum,
} from '../../../shared/ticketing/enums/ticketing.enum';

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// dto
import { CreateTicketContractDto } from '../../../shared/ticketing/ticketing.dto';

export class CreateTicketDto extends BaseMapper<CreateTicketContractDto> {
    protected ContractClass = CreateTicketContractDto;

    @IsString()
    organization: string;

    @IsString()
    location: string;

    @IsEnum(TicketCategoryEnum)
    category: TicketCategoryEnum;

    @IsString()
    description: string;

    @IsString()
    code: string;

    @IsEnum(TicketSiteTypeEnum)
    siteType: TicketSiteTypeEnum;

    @IsEnum(TicketPriorityEnum)
    priority: TicketPriorityEnum;

    @IsString()
    contactName: string;

    @IsString()
    contactPhone: string;

    @IsString()
    requesterName: string;

    @IsString()
    requesterEmail: string;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;

    @IsEnum(TicketRequestTypeEnum)
    requestType: TicketRequestTypeEnum;
}
