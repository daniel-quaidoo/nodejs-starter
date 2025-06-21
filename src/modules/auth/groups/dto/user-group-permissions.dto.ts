import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class UserGroupPermissionDto {
    @IsString()
    user_group_permission_id: string;

    @IsArray()
    @Type(() => UserDto)
    user: UserDto[];

    @IsArray()
    @Type(() => GroupDto)
    group: GroupDto[];

    @IsArray()
    @Type(() => PermissionDto)
    permission: PermissionDto[];

    @IsArray()
    @Type(() => UserDto)
    granted_by: UserDto[];

    @IsString()
    granted_reason: string;

    @IsDate()
    @Type(() => Date)
    expires_at: Date;

}