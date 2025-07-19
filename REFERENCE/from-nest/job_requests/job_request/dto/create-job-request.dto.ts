import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { AccountTypeEnum } from "@lib/contracts/job_requests/enums/account-type.enum";
import { ActiveStatusEnum } from "@lib/contracts/job_requests/enums/active-status.enum";
import { IdentificationTypeEnum } from "@lib/contracts/job_requests/enums/id-type.enum";
import { JobStatusEnum } from "@lib/contracts/job_requests/enums/job-status.enum";
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsEmail, IsOptional, IsEnum, IsNumber, IsUUID } from "class-validator";


export class CreateJobRequestDto {

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f095', description: 'Service ID for the requested service' })
    @IsUUID()
    service_id: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f096', description: 'User ID of the client requesting the service' })
    @IsUUID()
    user_id: string;

    @ApiProperty({ example: 'John Doe', description: 'Full name of the client' })
    @IsString()
    client_name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the client' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '+233501234567', description: 'Primary phone number of the client' })
    @IsString()
    phone_number: string;

    @ApiProperty({ example: '+233501234568', description: 'Mobile number of the client' })
    @IsString()
    @IsOptional()
    mobile_number?: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'Mailing address reference' })
    @IsOptional()
    @IsString()
    mailing_address_id?: any;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f096', description: 'Residential address reference' })
    @IsOptional()
    @IsString()
    residential_address_id: any;

    @ApiProperty({ example: IdentificationTypeEnum.GHANA_CARD, description: 'Type of identification provided' })
    @IsEnum(IdentificationTypeEnum)
    id_type: IdentificationTypeEnum;

    @ApiProperty({ example: 'GHA-123456789-0', description: 'ID number provided for verification' })
    @IsString()
    id_number: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'ID document media reference' })
    @IsString()
    id_document: string;

    @ApiProperty({ example: 'TIN-87654321', description: 'Tax Identification Number (TIN)' })
    @IsString()
    tin_number: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'TIN document media reference' })
    @IsString()
    tin_document: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f093', description: 'Contact person reference' })
    @IsOptional()
    @IsString()
    contact: any;

    @ApiProperty({ example: 30, description: 'Progress of the job request in percentage' })
    @IsNumber()
    progress: number;

    @ApiProperty({ example: 'Leasehold', description: 'Type of land' })
    @IsString()
    land_type: string;

    @ApiProperty({ example: 'Residential', description: 'Type of interest' })
    @IsString()
    interest_type: string;

    @ApiProperty({ example: 90, description: 'Estimated duration for job completion (in days)' })
    @IsNumber()
    duration: number;

    @ApiProperty({ example: 5000.00, description: 'Estimated cost of the job' })
    @IsNumber()
    cost: number;

    @ApiProperty({ example: JobStatusEnum.NEW, description: 'Current status of the job request' })
    @IsEnum(JobStatusEnum)
    status: JobStatusEnum;

    @ApiProperty({ example: ActiveStatusEnum.ACTIVE, description: 'Active status of the job' })
    @IsEnum(ActiveStatusEnum)
    active_status: ActiveStatusEnum;

    @ApiProperty({ example: AccountTypeEnum.INDIVIDUAL, description: 'Type of account associated with the job request' })
    @IsEnum(AccountTypeEnum)
    account_type: AccountTypeEnum;

    @ApiProperty({ example: PaymentStatusEnum.Pending, description: 'Payment status for the job' })
    @IsEnum(PaymentStatusEnum)
    payment_status: PaymentStatusEnum;

}
