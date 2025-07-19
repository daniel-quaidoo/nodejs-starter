import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from './group.dto';
import { CreateGroupContractDto } from '../../../../shared/auth/groups/create-group.dto';

export class CreateUserGroupDto extends BaseMapper<CreateGroupContractDto> {
    protected ContractClass = CreateGroupContractDto;

    @IsString()
    user_group_id: string;

    @IsOptional()
    @Type(() => UserDto)
    user: UserDto;

    @IsOptional()
    @Type(() => GroupDto)
    group: GroupDto;

    @IsString()
    isActive: boolean;

    @IsDate()
    @Type(() => Date)
    created_at: Date;

    @IsDate()
    @Type(() => Date)
    updated_at: Date;
}
