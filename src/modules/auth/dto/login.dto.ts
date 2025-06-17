import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../types';

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    user?: User;
}

export class LoginResponseDto {
    id: string;
    email: string;
    accessToken?: string;
}
