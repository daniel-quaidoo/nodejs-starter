import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';
import { UpdateUserGroupContractDto } from '../../../../shared/auth/groups/update-user-group.dto';

export class UpdateUserGroupDto extends BaseMapper<UpdateUserGroupContractDto> {
    protected ContractClass = UpdateUserGroupContractDto;
    @IsString()
    @IsOptional()
    user_group_id?: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    user?: UserDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    group?: GroupDto[];

    @IsString()
    @IsOptional()
    isActive?: boolean;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    created_at?: Date;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    updated_at?: Date;
}
