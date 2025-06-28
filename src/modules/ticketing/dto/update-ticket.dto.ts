import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import {
    TicketPriorityEnum,
    TicketStatusEnum,
} from '../../../shared/ticketing/enums/ticketing.enum';

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// dto
import { UpdateTicketContractDto } from '../../../shared/ticketing/ticketing.dto';

export class UpdateTicketDto extends BaseMapper<UpdateTicketContractDto> {
    protected ContractClass = UpdateTicketContractDto;

    @IsEnum(TicketPriorityEnum)
    @IsOptional()
    priority?: TicketPriorityEnum;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    contactName?: string;

    @IsString()
    @IsOptional()
    contactPhone?: string;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;

    @IsEnum(TicketStatusEnum)
    @IsOptional()
    status?: TicketStatusEnum;
}
