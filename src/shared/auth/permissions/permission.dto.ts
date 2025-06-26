// dto
import { CreateRoleContractDto } from '../roles/create-role.dto';
import { CreateGroupContractDto } from '../groups/create-group.dto';

export class PermissionContractDto {
    permission_id: string;
    name: string;
    alias: string;
    description: string;
    roles: CreateRoleContractDto[];
    groups: CreateGroupContractDto[];
}
