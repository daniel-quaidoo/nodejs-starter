import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Inject } from 'typedi';

// interface
import { JwtPayload } from './core/auth.interface';

// config
import { ConfigService } from '../../config/configuration';

// decorator
import { Service } from '../../core/common/di/component.decorator';

// service
import { UserService } from './users/service/user.service';
import { UserCredsService } from './users/service/user-creds.service';
import { TokenBlacklistService } from './core/token-blacklist.service';

// exception
import {
    BadRequestException,
    NotFoundException,
    UnauthorizedException,
} from '../../core/common/exceptions/http.exception';

// dto
import {
    ChangePasswordContractDto,
    MailActionContractDto,
    ResetPasswordContractDto,
    LoginResponseContractDto,
    LoginContractDto,
    LoginValidateContractDto,
} from '../../shared/auth/auth.dto';

@Service()
export class AuthService {
    private readonly JWT_SECRET: any;
    private readonly JWT_EXPIRES_IN: any;

    constructor(
        @Inject() private readonly userService: UserService,
        @Inject() private readonly configService: ConfigService,
        @Inject() private readonly userCredsService: UserCredsService,
        @Inject() private readonly tokenBlacklist: TokenBlacklistService
    ) {
        this.JWT_SECRET = this.configService.get('JWT_SECRET');
        this.JWT_EXPIRES_IN = this.configService.get('JWT_EXPIRES_IN');
    }

    public async verifyToken(token: string): Promise<JwtPayload> {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        if (await this.tokenBlacklist.isBlacklisted(token)) {
            throw new UnauthorizedException('Token has been invalidated');
        }

        try {
            return jwt.verify(token, this.JWT_SECRET) as JwtPayload;
        } catch (error: any) {
            if (error?.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            }
            throw new UnauthorizedException('Invalid token');
        }
    }

    // validate user credentials
    public async validateUser(input: LoginContractDto): Promise<LoginValidateContractDto | null> {
        const user = await this.userService.findUserByEmail(input.email, true);

        if (!user || !('credentials' in user)) {
            return null;
        }
        const isPasswordValid = await bcrypt.compare(
            input.password,
            user.credentials.password as string
        );

        // check if verified
        if (!user.credentials.isVerified) {
            throw new UnauthorizedException('Email not verified');
        }

        if (isPasswordValid) {
            return {
                user_id: user.userId,
                email: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                roles: user.roles,
            };
        }

        return null;
    }

    public async signIn(loginDto: LoginContractDto): Promise<LoginResponseContractDto> {
        const user = await this.validateUser(loginDto);

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokenPayload = {
            sub: user.user_id,
            ...user,
        };
        const accessToken = jwt.sign(tokenPayload, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRES_IN,
        });

        return {
            access_token: accessToken,
            email: user.email,
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
        };
    }

    public async signOut(token: string): Promise<{ message: string }> {
        if (!token) {
            throw new BadRequestException('Token is required');
        }

        try {
            const decoded = jwt.verify(token, this.JWT_SECRET, {
                ignoreExpiration: true,
            }) as JwtPayload;
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);

            if (expiresIn > 0) {
                await this.tokenBlacklist.addToBlacklist(token, expiresIn);
            }

            return { message: 'Successfully signed out' };
        } catch (error: any) {
            throw new UnauthorizedException(error.message);
        }
    }

    // reset password
    public async resetPassword(
        input: ResetPasswordContractDto
    ): Promise<{ message: string } | any> {
        const user = await this.userService.findUserByEmail(input.email, true);

        if (!user || !('credentials' in user)) {
            throw new NotFoundException(`User with email ${input.email} not found`);
        }

        user.credentials.resetToken = crypto.randomUUID();
        await this.userService.update(user.userId, user);

        // reset link
        // const feBaseUrl = this.configService.get('FE_BASE_URL');
        // const resetLink = `${feBaseUrl}/account/change-password?email=${user.email}&token=${user.credentials.resetToken}`;

        // send reset token link
        // if (user) {
        //     await this.mailService.sendPasswordResetMail({
        //         first_name: user.firstName,
        //         last_name: user.lastName,
        //         email: user.email,
        //         reset_link: resetLink,
        //     } as ResetPasswordMailDto);
        // }

        return { message: 'Reset link sent successfully' };
    }

    public async changePassword(input: ChangePasswordContractDto): Promise<{ message: string }> {
        const user = await this.userService.findUserByEmail(input.email, true);

        if (!user || !('credentials' in user)) {
            throw new UnauthorizedException('User not found');
        }

        const isValidToken = input.token === user.credentials.resetToken;

        if (!isValidToken) {
            throw new UnauthorizedException('Invalid reset token');
        }

        // update password
        user.credentials.password = bcrypt.hashSync(input.newPassword, 10);
        user.credentials.resetToken = '';
        await this.userService.update(user.userId, user);

        // send confirmation email
        return { message: 'Password changed successfully' };
    }

    // verify email
    public async verifyEmail(token: string): Promise<boolean> {
        const userCreds = await this.userCredsService.findOne({
            verificationToken: token,
        });

        if (!userCreds) {
            throw new NotFoundException(`Invalid verification token`);
        }

        // Mark email as verified
        userCreds.isVerified = true;
        userCreds.verificationToken = '';
        await this.userCredsService.update(userCreds.userCredentialsId, userCreds);

        // Send welcome email
        // await this.mailService.sendWelcomeMail({
        //     first_name: userCreds.user.firstName,
        //     last_name: userCreds.user.lastName,
        //     email: userCreds.user.email,
        //     user_id: userCreds.user.userId,
        // } as WelcomeMailDto);

        return true;
    }

    // unsubscribe user from emails
    public async unsubscribeEmail(input: MailActionContractDto): Promise<void> {
        const user = await this.userService.findUserByEmail(input.email, true);

        if (!user || !('credentials' in user)) {
            throw new NotFoundException(`User with email ${input.email} not found`);
        }

        // unsubscribe user
        user.credentials.isSubscribed = false;

        await this.userService.update(user.userId, user);
    }

    // subscribe user to emails
    public async subscribeEmail(input: MailActionContractDto): Promise<{ message: string }> {
        const user = await this.userService.findUserByEmail(input.email);

        if (!user || !('credentials' in user)) {
            throw new NotFoundException(`User with email ${input.email} not found`);
        }

        if (user.credentials.isSubscribedToken == input.token) {
            // subscribe user
            user.credentials.isSubscribed = true;
            await this.userService.update(user.userId, user);

            return { message: 'Successfully subscribed to emails' };
        }

        throw new BadRequestException('Error subscribing email!');
    }
}
