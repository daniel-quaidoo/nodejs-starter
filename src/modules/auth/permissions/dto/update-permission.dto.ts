import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { UpdatePermissionContractDto } from '../../../../shared/auth/permissions/update-permission.dto';

export class UpdatePermissionDto extends BaseMapper<UpdatePermissionContractDto> {
    protected ContractClass = UpdatePermissionContractDto;
    @IsString()
    @IsOptional()
    permission_id?: string;

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
    @Type(() => RoleDto)
    roles?: RoleDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    groups?: GroupDto[];
}
