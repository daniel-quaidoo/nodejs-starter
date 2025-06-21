import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class UpdateUserGroupDto {
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
