import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from './group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { UpdateUserGroupPermissionContractDto } from '../../../../shared/auth/groups/update-user-group-permissions.dto';

export class UpdateUserGroupPermissionDto extends BaseMapper<UpdateUserGroupPermissionContractDto> {
    protected ContractClass = UpdateUserGroupPermissionContractDto;
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
