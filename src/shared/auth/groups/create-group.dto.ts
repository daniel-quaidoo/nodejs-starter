// dto
import { UserGroupContractDto } from './user-group.dto';
import { PermissionContractDto } from '../permissions/permission.dto';

export class CreateGroupContractDto {
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
    userGroups?: UserGroupContractDto[];
    permissions?: PermissionContractDto[];
}
