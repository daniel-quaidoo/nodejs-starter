import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";


export class CreateJobAssignmentDto {

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f096', description: 'ID of the job request being assigned '})
    @IsUUID()
    jobRequestId: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f097', description: 'ID of the user to whom the job is assigned' })
    @IsUUID()
    assigned_to: string;
  
}