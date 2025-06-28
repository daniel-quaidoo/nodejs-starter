import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsString, IsUUID } from 'class-validator';

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// enum
import {
    TicketCategoryEnum,
    TicketPriorityEnum,
    TicketRequestTypeEnum,
    TicketSiteTypeEnum,
    TicketStatusEnum,
} from '../../../shared/ticketing/enums/ticketing.enum';

// dto
import { TicketContractDto } from '../../../shared/ticketing/ticketing.dto';

export class TicketDto extends BaseMapper<TicketContractDto> {
    protected ContractClass = TicketContractDto;

    @IsString()
    caseNumber: string;

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
    assignedToId: string | null;

    @IsEnum(TicketRequestTypeEnum)
    requestType: TicketRequestTypeEnum;

    @IsEnum(TicketStatusEnum)
    status: TicketStatusEnum;

    @IsDate()
    @Type(() => Date)
    createdAt: Date;

    @IsDate()
    @Type(() => Date)
    updatedAt: Date;
}
