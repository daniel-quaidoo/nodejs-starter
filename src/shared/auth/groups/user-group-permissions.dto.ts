// dto
import { GroupDto } from './group.dto';
import { UserDto } from '../users/user.dto';
import { PermissionDto } from '../permissions/permission.dto';

export class UserGroupPermissionDto {
    user_group_permission_id: string;
    user: UserDto;
    group: GroupDto;
    permission: PermissionDto;
    granted_by: UserDto;
    granted_reason: string;
    expires_at: Date;
    created_at: Date;
    updated_at: Date;
}
