// dto
import { UserGroupDto } from './user-group.dto';
import { PermissionDto } from '../permissions/permission.dto';

export class CreateGroupDto {
    name: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
    userGroups?: UserGroupDto[];
    permissions?: PermissionDto[];
}
