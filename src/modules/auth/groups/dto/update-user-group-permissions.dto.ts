import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class UpdateUserGroupPermissionDto {
    @IsString()
    @IsOptional()
    user_group_permission_id?: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    user?: UserDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    group?: GroupDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permission?: PermissionDto[];

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    granted_by?: UserDto[];

    @IsString()
    @IsOptional()
    granted_reason?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    expires_at?: Date;

}