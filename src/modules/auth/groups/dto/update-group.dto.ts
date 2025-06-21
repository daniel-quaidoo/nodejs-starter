import { Type } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsString } from 'class-validator';

// dto
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class UpdateGroupDto {
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