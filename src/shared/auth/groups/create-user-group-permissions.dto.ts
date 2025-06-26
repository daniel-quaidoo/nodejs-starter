// dto
import { GroupContractDto } from './group.dto';
import { UserContractDto } from '../users/user.dto';
import { PermissionContractDto } from '../permissions/permission.dto';

export class CreateUserGroupPermissionDto {
    user: UserContractDto;
    group: GroupContractDto;
    permission: PermissionContractDto;
    granted_by: UserContractDto;
    granted_reason?: string;
    expires_at?: Date;
    created_at: Date;
    updated_at: Date;
}
