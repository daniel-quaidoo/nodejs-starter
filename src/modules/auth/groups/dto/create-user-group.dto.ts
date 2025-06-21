import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class CreateUserGroupDto {
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
