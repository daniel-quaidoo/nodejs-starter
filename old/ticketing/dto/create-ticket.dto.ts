import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {IsString,IsEnum,IsOptional,IsUUID,IsEmail, Matches} from 'class-validator';

//enums
import { TicketCategoryEnum } from '@lib/contracts/ticketing/enums/category.enum';
import { TicketSiteTypeEnum } from '@lib/contracts/ticketing/enums/site-type.enum';
import { TicketPriorityEnum } from '@lib/contracts/ticketing/enums/priority.enum';
import { TicketRequestTypeEnum } from '@lib/contracts/ticketing/enums/request-type.enum';
import { TicketStatusEnum } from '@lib/contracts/ticketing/enums/status.enum';
import { UserDto } from '../../auth/users/dto/user.dto';
import { Type } from 'class-transformer';
import { User } from '../../auth/users/entities/user.entity';


export class CreateTicketDto {

    @ApiProperty({ example: 'CS2345678', description: 'Unique case number' })
    @IsString()
    @Matches(/^CS\d{7}$/, { message: 'case_number must match format CS followed by 7 digits' })
    case_number: string;

    @ApiProperty({ description: 'Organization name' , example: 'Access Bank'})
    @IsString()
    organization: string;

    @ApiProperty({ description: 'Location' , example: 'Tema Main '})
    @IsString()
    location: string;

    @ApiPropertyOptional({ enum: TicketCategoryEnum, default: TicketCategoryEnum.GRG })
    @IsEnum(TicketCategoryEnum)
    @IsOptional()
    category?: TicketCategoryEnum;

    @ApiProperty({ description: 'Ticket description', example: 'SetUp Problem' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Ticket code', example: 'ERR_388'})
    @IsString()
    code: string;

    @ApiPropertyOptional({ enum: TicketSiteTypeEnum, default: TicketSiteTypeEnum.BRANCH })
    @IsEnum(TicketSiteTypeEnum)
    @IsOptional()
    site_type?: TicketSiteTypeEnum;

    @ApiPropertyOptional({ enum: TicketPriorityEnum, default: TicketPriorityEnum.LOW })
    @IsEnum(TicketPriorityEnum)
    @IsOptional()
    priority?: TicketPriorityEnum;

    @ApiProperty({ description: 'Contact name' , example: 'Ama Aidoo'})
    @IsString()
    contact_name: string;

    @ApiProperty({ description: 'Contact phone number', example: '+233 667927892' })
    @IsString()
    contact_phone: string;

    @ApiProperty({ description: 'Name of requester', example: 'Kwame Kakari' })
    @IsString()
    requester_name: string;

    @ApiProperty({ description: 'Email of requester', example: 'kwamek@abc.com' })
    @IsEmail()
    requester_email: string;

    @ApiProperty({ description: 'Assigned user' , type: [UserDto]})
    @Type(() => UserDto)
    @IsUUID()
    assigned_to: User;

    @ApiProperty({ enum: TicketRequestTypeEnum })
    @IsEnum(TicketRequestTypeEnum)
    request_type: TicketRequestTypeEnum;

    @ApiProperty({ enum: TicketStatusEnum })
    @IsEnum(TicketStatusEnum)
    status: TicketStatusEnum;
}
