import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class CreateGroupDto {
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
