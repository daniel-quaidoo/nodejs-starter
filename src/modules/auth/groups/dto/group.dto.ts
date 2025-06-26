import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';
import { CreateGroupContractDto } from '../../../../shared/auth/groups/create-group.dto';

export class GroupDto extends BaseMapper<CreateGroupContractDto> {
    protected ContractClass = CreateGroupContractDto;
    @IsString()
    group_id: string;

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsDate()
    @Type(() => Date)
    created_at: Date;

    @IsDate()
    @Type(() => Date)
    updated_at: Date;

    @IsArray()
    @Type(() => UserGroupDto)
    userGroups: UserGroupDto[];

    @IsArray()
    @Type(() => PermissionDto)
    permissions: PermissionDto[];
}
