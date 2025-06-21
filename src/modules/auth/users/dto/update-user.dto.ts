import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

// enum
import { Gender } from '../../../../shared/auth/users/enums/gender.enum';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { RoleDto } from '../../roles/dto/role.dto';
import { ContactDto } from '../../contacts/dto/contact.dto';
import { UserGroupDto } from '../../groups/dto/user-group.dto';
import { UpdateUserContractDto } from '../../../../shared/auth/users/update-user.dto';

export class UpdateUserDto extends BaseMapper<UpdateUserContractDto> {
    protected ContractClass = UpdateUserContractDto;

    @IsString()
    @IsOptional()
    user_id?: string;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsString()
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone_number?: string;

    @IsString()
    @IsOptional()
    identification_number?: string;

    @IsString()
    @IsOptional()
    photo_url?: string;

    @IsBoolean()
    @IsOptional()
    is_active?: boolean;

    @IsEnum(Gender)
    @IsOptional()
    gender?: Gender;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date_of_birth?: Date;

    @IsArray()
    @IsOptional()
    @Type(() => RoleDto)
    roles?: RoleDto[];

    @IsArray()
    @IsOptional()
    @Type(() => UserGroupDto)
    userGroups?: UserGroupDto[];

    @IsArray()
    @IsOptional()
    @Type(() => ContactDto)
    contacts?: ContactDto[];

}