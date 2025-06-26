import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { GroupDto } from './group.dto';
import { UserDto } from '../../users/dto/user.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { UserGroupPermissionContractDto } from '../../../../shared/auth/groups/user-group-permissions.dto';

export class UserGroupPermissionDto extends BaseMapper<UserGroupPermissionContractDto> {
    protected ContractClass = UserGroupPermissionContractDto;

    @IsString()
    @IsUUID()
    user_group_permission_id: string;

    @IsString()
    @IsOptional()
    group_id?: string;

    @IsString()
    @IsOptional()
    permission_id?: string;

    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    granted_by?: string;

    @IsString()
    @IsOptional()
    granted_reason?: string;

    @IsDate()
    @Type(() => Date)
    @IsOptional()
    expires_at?: Date;

    @Type(() => Date)
    created_at: Date;

    @Type(() => Date)
    updated_at: Date;

    @IsArray()
    @Type(() => PermissionDto)
    @IsOptional()
    permission?: PermissionDto[];

    @IsArray()
    @Type(() => GroupDto)
    @IsOptional()
    group?: GroupDto[];

    @IsArray()
    @Type(() => UserDto)
    @IsOptional()
    user?: UserDto[];
}
