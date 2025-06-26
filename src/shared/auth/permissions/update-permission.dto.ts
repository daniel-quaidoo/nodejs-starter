// dto
import { RoleContractDto } from '../roles/role.dto';
import { GroupContractDto } from '../groups/group.dto';

export class UpdatePermissionContractDto {
    permission_id?: string;
    name?: string;
    alias?: string;
    description?: string;
    roles?: RoleContractDto[];
    groups?: GroupContractDto[];
}
