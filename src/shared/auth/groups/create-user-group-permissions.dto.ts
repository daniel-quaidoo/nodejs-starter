// dto
import { GroupDto } from './group.dto';
import { UserDto } from '../users/user.dto';
import { PermissionDto } from '../permissions/permission.dto';

export class CreateUserGroupPermissionDto {
    user: UserDto;
    group: GroupDto;
    permission: PermissionDto;
    granted_by: UserDto;
    granted_reason?: string;
    expires_at?: Date;
    created_at: Date;
    updated_at: Date;
}