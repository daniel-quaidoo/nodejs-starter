import { Inject } from "typedi";

// service
import { AuthService } from "./auth.service";

// decorator
import { Body } from "../../core/common/decorators/param.decorator";
import { Controller, Post } from "../../core/common/decorators/route.decorator";

// dto
import { LoginDto, LoginResponseDto, LogoutDto, LogoutResponseDto } from "./core/auth.dto";

@Controller('/auth')
export class AuthController {
    constructor(
        @Inject() private readonly authService: AuthService
    ) { }

    @Post('/login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
        return await this.authService.signIn(loginDto);
    }

    @Post('/logout')
    async logout(@Body() logoutDto: LogoutDto): Promise<LogoutResponseDto> {
        return await this.authService.signOut(logoutDto.token);
    }   
}