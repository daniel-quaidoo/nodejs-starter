// dto
import { CreateUserContractDto } from '../users/create-user.dto';
import { CreatePermissionContractDto } from '../permissions/create-permission.dto';

export class RoleContractDto {
    role_id: number;
    name: string;
    alias: string;
    description: string;
    users: CreateUserContractDto[];
    permissions: CreatePermissionContractDto[];
}
