// dto
import { UserContractDto } from '../users/user.dto';
import { CreateUserContractDto } from '../users/create-user.dto';
import { CreatePermissionContractDto } from '../permissions/create-permission.dto';

export class UpdateRoleContractDto {
    role_id?: string;
    name?: string;
    alias?: string;
    description?: string;
    users?: CreateUserContractDto[] | UserContractDto[];
    permissions?: CreatePermissionContractDto[];
}
