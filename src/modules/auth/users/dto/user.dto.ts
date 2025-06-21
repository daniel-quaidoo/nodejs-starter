import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsString } from 'class-validator';

// enum
import { Gender } from '../../../../shared/auth/users/enums/gender.enum';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { ContactDto } from '../../contacts/dto/contact.dto';
import { UserGroupDto } from '../../groups/dto/user-group.dto';

export class UserDto {
    @IsString()
    user_id: string;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    phone_number: string;

    @IsBoolean()
    is_active: boolean;

    @IsString()
    identification_number: string;

    @IsString()
    photo_url: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsDate()
    @Type(() => Date)
    date_of_birth: Date;

    @IsArray()
    @Type(() => RoleDto)
    roles: RoleDto[];

    @IsArray()
    @Type(() => UserGroupDto)
    userGroups: UserGroupDto[];

    @IsArray()
    @Type(() => ContactDto)
    contacts: ContactDto[];

}