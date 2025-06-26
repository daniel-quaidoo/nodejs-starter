import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { CreateRoleContractDto } from '../../../../shared/auth/roles/create-role.dto';

export class CreateRoleDto extends BaseMapper<CreateRoleContractDto> {
    protected ContractClass = CreateRoleContractDto;

    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    users: UserDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permissions: PermissionDto[];
}
