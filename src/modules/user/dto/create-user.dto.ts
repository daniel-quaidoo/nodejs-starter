import { IsEmail, IsString, MinLength, IsEnum, IsNotEmpty, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

// dto
import { BaseDto } from '../../../core/common/dto/base.dto';

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    MODERATOR = 'moderator',
    GUEST = 'guest',
}

export class CreateUserDto extends BaseDto<CreateUserDto> {
    @IsString()
    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(100)
    @Transform(({ value }) => value?.trim())
    name: string;

    @IsEmail()
    @Transform(({ value }) => value?.toLowerCase()?.trim())
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
