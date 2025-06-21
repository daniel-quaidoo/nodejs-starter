import { Type } from 'class-transformer';
import { IsBoolean, IsString } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';

export class ContactDto {
    @IsString()
    id: String;

    @Type(() => UserDto)
    user: UserDto;

    @IsString()
    first_name: String;

    @IsString()
    last_name: String;

    @IsString()
    email: String;

    @IsString()
    relation: String;

    @IsString()
    number: String;

    @IsBoolean()
    is_emergency_contact: boolean;
}