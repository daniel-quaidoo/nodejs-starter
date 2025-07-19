import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";


export class UpdateJobAssignmentDto {

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f097', description: 'ID of the user to whom the job was assigned' })
    @IsUUID()
    old_assigned_to: string;

    @ApiProperty({ example: '0dd2e82f-63ab-46d6-8ae6-54ea4988f097', description: 'ID of the user to whom the job is to be assigned' })
    @IsUUID()
    new_assigned_to: string;
  
}