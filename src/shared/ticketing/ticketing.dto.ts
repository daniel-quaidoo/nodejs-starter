import {
    TicketCategoryEnum,
    TicketPriorityEnum,
    TicketRequestTypeEnum,
    TicketSiteTypeEnum,
    TicketStatusEnum,
} from './enums/ticketing.enum';

export class CreateTicketContractDto {
    organization: string;
    location: string;
    category: TicketCategoryEnum;
    description: string;
    code: string;
    siteType: TicketSiteTypeEnum;
    priority: TicketPriorityEnum;
    contactName: string;
    contactPhone: string;
    requesterName: string;
    requesterEmail: string;
    assignedToId?: string;
    requestType: TicketRequestTypeEnum;
}

export class UpdateTicketContractDto {
    priority?: TicketPriorityEnum;
    description?: string;
    contactName?: string;
    contactPhone?: string;
    assignedToId?: string;
    status?: TicketStatusEnum;
}

export class TicketContractDto {
    caseNumber: string;
    organization: string;
    location: string;
    category: TicketCategoryEnum;
    description: string;
    code: string;
    siteType: TicketSiteTypeEnum;
    priority: TicketPriorityEnum;
    contactName: string;
    contactPhone: string;
    requesterName: string;
    requesterEmail: string;
    assignedToId?: string;
    requestType: TicketRequestTypeEnum;
    status?: TicketStatusEnum;
}
