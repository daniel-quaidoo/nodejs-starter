import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserGroupDto } from './user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { CreateGroupContractDto } from '../../../../shared/auth/groups/create-group.dto';

export class CreateGroupDto extends BaseMapper<CreateGroupContractDto> {
    protected ContractClass = CreateGroupContractDto;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserGroupDto)
    userGroups?: UserGroupDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permissions?: PermissionDto[];
}
