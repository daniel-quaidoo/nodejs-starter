import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { GroupDto } from '../../groups/dto/group.dto';

export class UpdatePermissionDto {
    @IsString()
    @IsOptional()
    permission_id?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    alias?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    @Type(() => RoleDto)
    roles?: RoleDto[];

    @IsArray()
    @IsOptional()
    @Type(() => GroupDto)
    groups?: GroupDto[];

}