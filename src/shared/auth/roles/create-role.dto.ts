// dto
import { CreateUserContractDto } from '../users/create-user.dto';
import { CreatePermissionDto } from '../permissions/create-permission.dto';

export class CreateRoleContractDto {
    name: string;
    alias: string;
    description: string;
    users: CreateUserContractDto[];
    permissions: CreatePermissionDto[];
}