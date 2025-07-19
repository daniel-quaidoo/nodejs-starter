import { PaymentStatusEnum } from "@lib/contracts/billing/enums/payment-status.enum";
import { AccountTypeEnum } from "@lib/contracts/job_requests/enums/account-type.enum";
import { ActiveStatusEnum } from "@lib/contracts/job_requests/enums/active-status.enum";
import { IdentificationTypeEnum } from "@lib/contracts/job_requests/enums/id-type.enum";
import { JobStatusEnum } from "@lib/contracts/job_requests/enums/job-status.enum";
import { ApiProperty } from "@nestjs/swagger";


export class JobRequestDto {

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f098', description: 'Unique identifier of the job request' })
    id: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f095', description: 'Service ID for the requested service' })
    service_id: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f096', description: 'User ID of the client requesting the service' })
    user_id: string;

    @ApiProperty({ example: 'John Doe', description: 'Full name of the client' })
    client_name: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Email of the client' })
    email: string;

    @ApiProperty({ example: '+233501234567', description: 'Primary phone number of the client' })
    phone_number: string;

    @ApiProperty({ example: '+233501234568', description: 'Mobile number of the client' })
    mobile_number: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'Mailing address reference' })
    mailing_address_id: any;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f096', description: 'Residential address reference' })
    residential_address_id: any;

    @ApiProperty({ example: IdentificationTypeEnum.GHANA_CARD, description: 'Type of identification provided' })
    id_type: IdentificationTypeEnum;

    @ApiProperty({ example: 'GHA-123456789-0', description: 'ID number provided for verification' })
    id_number: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'ID document media reference' })
    id_document: string;

    @ApiProperty({ example: 'TIN-87654321', description: 'Tax Identification Number (TIN)' })
    tin_number: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f094', description: 'TIN document media reference' })
    tin_document: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f093', description: 'Contact person reference' })
    contact: any;

    @ApiProperty({ example: 30, description: 'Progress of the job request in percentage' })
    progress: number;

    @ApiProperty({ example: 'Leasehold', description: 'Type of land' })
    land_type: string;

    @ApiProperty({ example: 'Residential', description: 'Type of interest' })
    interest_type: string;

    @ApiProperty({ example: 90, description: 'Estimated duration for job completion (in days)' })
    duration: number;

    @ApiProperty({ example: 5000.00, description: 'Estimated cost of the job' })
    cost: number;

    @ApiProperty({ example: JobStatusEnum.NEW, description: 'Current status of the job request' })
    status: JobStatusEnum;

    @ApiProperty({ example: ActiveStatusEnum.ACTIVE, description: 'Active status of the job' })
    active_status: ActiveStatusEnum;

    @ApiProperty({ example: AccountTypeEnum.INDIVIDUAL, description: 'Type of account associated with the job request' })
    account_type: AccountTypeEnum;

    @ApiProperty({ example: PaymentStatusEnum.Pending, description: 'Payment status for the job' })
    payment_status: PaymentStatusEnum;

}
