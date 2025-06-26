import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { UpdateRoleContractDto } from '../../../../shared/auth/roles/update-role.dto';

export class UpdateRoleDto extends BaseMapper<UpdateRoleContractDto> {
    protected ContractClass = UpdateRoleContractDto;

    @IsString()
    @IsOptional()
    role_id?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    alias?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    users?: UserDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permissions?: PermissionDto[];
}
