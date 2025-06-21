import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class CreateUserGroupPermissionDto {
    @IsString()
    user_group_permission_id: string;

    @IsOptional()
    @Type(() => UserDto)
    user: UserDto;

    @IsOptional()
    @Type(() => GroupDto)
    group: GroupDto;

    @IsOptional()
    @Type(() => PermissionDto)
    permission: PermissionDto;

    @IsOptional()
    @Type(() => UserDto)
    granted_by: UserDto;

    @IsString()
    @IsOptional()
    granted_reason?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    expires_at?: Date;
}