import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class PermissionDto {
    @IsString()
    permission_id: string;

    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @Type(() => RoleDto)
    roles: RoleDto[];

    @IsArray()
    @Type(() => GroupDto)
    groups: GroupDto[];
}
