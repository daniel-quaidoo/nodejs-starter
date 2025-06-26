import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

// Base DTOs
class EmailDto {
    @IsEmail()
    @IsNotEmpty()
    email!: string;
}

class TokenDto extends EmailDto {
    @IsString()
    @IsNotEmpty()
    token!: string;
}

// Login
export class LoginDto extends EmailDto {
    @IsString()
    @IsNotEmpty()
    password!: string;
}

export class LoginResponseDto {
    user_id: string;
    email: string;
    access_token?: string;
}

// Logout
/**
 * @deprecated Use the logout endpoint instead
 * Fetch the token from the Authorization header
 */
export class LogoutDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class LogoutResponseDto {
    message: string;
}

export class ChangePasswordDto extends TokenDto {
    @IsString()
    @IsNotEmpty()
    newPassword!: string;
}

export class MailActionDto extends TokenDto {}

export class ResetPasswordDto extends EmailDto {}

export class SendEmailDto {
    @IsString() @IsNotEmpty() recipient!: string;
    @IsString() @IsNotEmpty() first_name!: string;
    @IsString() @IsNotEmpty() last_name!: string;
    @IsEmail() @IsNotEmpty() user_email!: string;
    [key: string]: any;
}

export class VerifyEmailDto extends TokenDto {}

// Aliases
export const SubscribeEmailDto = MailActionDto;
export const UnsubscribeEmailDto = MailActionDto;
