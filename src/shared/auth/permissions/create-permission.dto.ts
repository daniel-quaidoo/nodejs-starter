// dto
import { CreateRoleContractDto } from '../roles/create-role.dto';
import { CreateGroupContractDto } from '../groups/create-group.dto';
import { RoleContractDto } from '../roles/role.dto';
import { GroupContractDto } from '../groups/group.dto';

export class CreatePermissionContractDto {
    name: string;
    alias: string;
    description: string;
    roles?: CreateRoleContractDto[] | RoleContractDto[];
    groups?: CreateGroupContractDto[] | GroupContractDto[];
}
