import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class CreatePermissionDto {
    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @IsOptional()
    @Type(() => RoleDto)
    roles: RoleDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    groups: GroupDto[];

}