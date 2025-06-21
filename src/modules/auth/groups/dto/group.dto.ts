import { Type } from 'class-transformer';
import { IsArray, IsDate, IsString } from 'class-validator';

// dto
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class GroupDto {
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
