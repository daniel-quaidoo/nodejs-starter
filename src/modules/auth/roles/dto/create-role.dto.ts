import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';
import { PermissionDto } from '../../permissions/dto/permission.dto';

export class CreateRoleDto {
    @IsString()
    name: string;

    @IsString()
    alias: string;

    @IsString()
    description: string;

    @IsArray()
    @IsOptional()
    @Type(() => UserDto)
    users: UserDto[];

    @IsArray()
    @IsOptional()
    @Type(() => PermissionDto)
    permissions: PermissionDto[];

}