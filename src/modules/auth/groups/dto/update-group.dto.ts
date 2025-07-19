import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserGroupDto } from './user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { UpdateGroupContractDto } from '../../../../shared/auth/groups/update-group.dto';

export class UpdateGroupDto extends BaseMapper<UpdateGroupContractDto> {
    protected ContractClass = UpdateGroupContractDto;
    @IsString()
    @IsOptional()
    group_id?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    created_at?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    updated_at?: Date;

    @IsArray()
    @IsOptional()
    @Type(() => UserGroupDto)
    userGroups?: UserGroupDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permissions?: PermissionDto[];
}
