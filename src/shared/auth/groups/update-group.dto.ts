// dto
import { UserGroupContractDto } from './user-group.dto';
import { PermissionContractDto } from '../permissions/permission.dto';

export class UpdateGroupContractDto {
    group_id?: string;
    name?: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
    userGroups?: UserGroupContractDto[];
    permissions?: PermissionContractDto[];
}
