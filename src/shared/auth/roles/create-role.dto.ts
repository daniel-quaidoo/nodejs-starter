// dto
import { CreateUserContractDto } from '../users/create-user.dto';
import { PermissionContractDto } from '../permissions/permission.dto';

export class CreateRoleContractDto {
    name: string;
    alias: string;
    description: string;
    users: CreateUserContractDto[];
    permissions: PermissionContractDto[];
}
