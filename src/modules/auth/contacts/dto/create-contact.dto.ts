import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';

export class CreateContactDto {
    @IsOptional()
    @Type(() => UserDto)
    user: UserDto;

    @IsString()
    first_name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    relation: string;

    @IsString()
    number: string;

    @IsBoolean()
    is_emergency_contact: boolean;
}
