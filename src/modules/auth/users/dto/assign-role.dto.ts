import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class AssignRoleDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(undefined, { each: true })
    role_ids: string[];
}