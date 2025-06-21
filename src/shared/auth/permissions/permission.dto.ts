// dto
import { CreateRoleDto } from '../roles/create-role.dto';
import { CreateGroupDto } from '../groups/create-group.dto';

export class PermissionDto {
    permission_id: string;
    name: string;
    alias: string;
    description: string;
    roles: CreateRoleDto[];
    groups: CreateGroupDto[];
}
