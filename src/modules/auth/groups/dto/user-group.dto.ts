import { Type } from 'class-transformer';
import { IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class UserGroupDto {
    @IsString()
    user_group_id: string;

    @Type(() => UserDto)
    user: UserDto;

    @Type(() => GroupDto)
    group: GroupDto;

    @IsString()
    isActive: boolean;
}