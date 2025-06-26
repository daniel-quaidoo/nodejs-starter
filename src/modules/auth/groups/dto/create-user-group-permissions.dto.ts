import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { CreatePermissionContractDto } from '../../../../shared/auth/permissions/create-permission.dto';

export class CreateUserGroupPermissionDto extends BaseMapper<CreatePermissionContractDto> {
    protected ContractClass = CreatePermissionContractDto;

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
