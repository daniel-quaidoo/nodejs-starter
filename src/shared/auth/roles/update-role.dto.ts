// dto
import { CreateUserDto } from '../users/create-user.dto';
import { CreatePermissionDto } from '../permissions/create-permission.dto';

export class UpdateRoleDto {
    role_id?: number;
    name?: string;
    alias?: string;
    description?: string;
    users?: CreateUserDto[];
    permissions?: CreatePermissionDto[];
}
