import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

// enum
import { Gender } from '../../../../shared/auth/users/enums/gender.enum';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { CreateRoleDto } from '../../roles/dto/create-role.dto';
import { ContactDto } from '../../contacts/dto/contact.dto';
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { CreateUserContractDto } from '../../../../shared/auth/users/create-user.dto';

export class CreateUserDto extends BaseMapper<CreateUserContractDto> {
    protected ContractClass = CreateUserContractDto;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    phone_number: string;

    @IsString()
    password?: string;

    @IsString()
    identification_number: string;

    @IsString()
    photo_url: string;

    @IsEnum(Gender)
    gender: Gender;

    @IsBoolean()
    is_active: boolean;

    @IsDate()
    @Type(() => Date)
    date_of_birth: Date;

    @IsArray()
    @IsOptional()
    @Type(() => CreateRoleDto)
    roles: (CreateRoleDto | string)[];

    @IsArray()
    @IsOptional()
    @Type(() => UserGroupDto)
    userGroups: UserGroupDto[];

    @IsArray()
    @IsOptional()
    @Type(() => ContactDto)
    contacts: ContactDto[];
}
