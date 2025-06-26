import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { CreatePermissionContractDto } from '../../../../shared/auth/permissions/create-permission.dto';

export class CreatePermissionDto extends BaseMapper<CreatePermissionContractDto> {
    protected ContractClass = CreatePermissionContractDto;

    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @IsOptional()
    @Type(() => RoleDto)
    roles: RoleDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    groups: GroupDto[];
}
