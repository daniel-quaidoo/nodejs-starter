import jwt from 'jsonwebtoken';
import { Inject } from 'typedi';

// types
import { User } from '../types';

// dto
import { LoginDto, LoginResponseDto } from '../dto/login.dto';

// service
import { UserService } from '../../user/service/user.service';

// config
import { ConfigService } from '../../../config/configuration';

// exception
import { UnauthorizedException } from '../../../core/common/exceptions/http.exception';

// decorator
import { Component, COMPONENT_TYPE } from '../../../core/common/di/component.decorator';


@Component({ type: COMPONENT_TYPE.SERVICE })
export class AuthService {
    private readonly config = new ConfigService();
    private readonly JWT_SECRET: any = this.config.get('JWT_SECRET');
    private readonly JWT_EXPIRES_IN: any = this.config.get('JWT_EXPIRES_IN');

    constructor(@Inject() private readonly userService: UserService) { }

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


    public generateToken(user: User): string {
        return jwt.sign(
            {
                sub: user.id,
                email: user.email,
                role: user.role
            },
            this.JWT_SECRET,
            { expiresIn: this.JWT_EXPIRES_IN }
        );
    }

    public verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.JWT_SECRET);
        } catch (error) {
            return null;
        }
    }
}
