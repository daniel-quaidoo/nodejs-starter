import { Inject } from 'typedi';

// service
import { AuthService } from './auth.service';

// entity
import { User } from './users/entities/user.entity';

// decorator
import { Body } from '../../core/common/decorators/param.decorator';
import { Controller, Post } from '../../core/common/decorators/route.decorator';

// dto
import { CreateUserDto } from './users/dto/create-user.dto';
import { LoginDto, LoginResponseDto, LogoutResponseDto } from './core/auth.dto';

@Controller('/auth')
export class AuthController {
    constructor(@Inject() private readonly authService: AuthService) {}

    @Post('/register')
    public register(@Body() registerDto: CreateUserDto): Promise<User> {
        const dto = new CreateUserDto();
        Object.assign(dto, registerDto);
        const user = this.authService.register(dto.toContract());
        return user;
    }

    @Post('/login')
    public login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return this.authService.signIn(loginDto);
    }

    @Post('/logout')
    public logout(): Promise<LogoutResponseDto> {
        const request = (this as any).req;
        const authIndex = request?.rawHeaders?.indexOf('Authorization') || -1;
        const authHeader =
            authIndex !== -1 ? request.rawHeaders[authIndex + 1] : request.headers['Authorization'];
        const token = authHeader?.split(' ')[1];

        return this.authService.signOut(token);
    }
}
