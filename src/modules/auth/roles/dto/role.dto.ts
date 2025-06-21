import { Type } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class RoleDto {
    @IsString()
    role_id: string;

    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @Type(() => UserDto)
    users: UserDto[];

    @IsArray()
    @Type(() => PermissionDto)
    permissions: PermissionDto[];

}