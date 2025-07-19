import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from './group.dto';
import { UserGroupContractDto } from '../../../../shared/auth/groups/user-group.dto';

export class UserGroupDto extends BaseMapper<UserGroupContractDto> {
    protected ContractClass = UserGroupContractDto;
    @IsString()
    user_group_id: string;

    @Type(() => UserDto)
    user: UserDto;

    @Type(() => GroupDto)
    group: GroupDto;

    @IsString()
    isActive: boolean;
}
