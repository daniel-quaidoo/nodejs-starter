import { Inject } from 'typedi';

// types
import { User } from '../types';

// dto
import { LoginDto, LoginResponseDto } from '../dto/login.dto';

// service
import { UserService } from '../../user/service/user.service';

// exception
import { UnauthorizedException } from '../../../core/common/exceptions/http.exception';

// decorator
import { Component, COMPONENT_TYPE } from '../../../core/common/di/component.decorator';

@Component({ type: COMPONENT_TYPE.SERVICE })
export class AuthService {
    constructor(@Inject() private readonly userService: UserService) {}

    async validateUser(email: string, password: string): Promise<Omit<User, 'password'>> {
        const user = await this.userService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.userService.validateUser(email, password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Remove password from the returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async login(loginDto: LoginDto): Promise<LoginResponseDto> {
        const user = await this.validateUser(loginDto.email, loginDto.password);

        // In a real application, you would generate a JWT token here
        // For now, we'll just return the user without a token
        return {
            id: user.id,
            email: user.email,
        };
    }

    async getProfile(userId: string): Promise<Omit<User, 'password'>> {
        const user = await this.userService.findById(userId);

        // Remove password from the returned user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
