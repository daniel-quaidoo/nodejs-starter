import { Type } from 'class-transformer';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

// dto
import { UserDto } from '../../users/dto/user.dto';

export class UpdateContactDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsOptional()
    @Type(() => UserDto)
    user?: UserDto;

    @IsString()
    @IsOptional()
    first_name?: string;

    @IsString()
    @IsOptional()
    last_name?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    relation?: string;

    @IsString()
    @IsOptional()
    number?: string;

    @IsBoolean()
    @IsOptional()
    is_emergency_contact?: boolean;
}