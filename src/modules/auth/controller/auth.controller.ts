import { Inject } from 'typedi';
import passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';

// types
import { AuthenticatedRequest } from '../types';

// service
import { AuthService } from '../service/auth.service';

// model
import { User } from '../../user/entities/user.entity';

// config
import { ConfigService } from '../../../config/configuration';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// decorator
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';
import { Controller, Get, Post } from "../../../core/common/decorators/route.decorator";

@Controller('/auth')
export class AuthController extends BaseController<any> {
    config: any;
    public router: Router;

    constructor(@Inject() private authService: AuthService) {
        super(authService as any);
        this.router = Router();
        this.config = new ConfigService();
    }

    /**
     * User login
     * @param req Request object containing email and password in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns user data and authentication token
     * @throws Error if authentication fails
     */
    @Post('/login')
    public login(req: Request, res: Response, next: NextFunction): void {
        const handleAuth = (err: Error | null, user?: User, info?: { message: string }): void => {
            if (err) {
                next(err);
                return;
            }

            if (!user) {
                const response: ApiResponse = {
                    success: false,
                    message: info?.message || 'Authentication failed',
                };
                res.status(401).json(response);
                return;
            }

            // Generate JWT token
            const token = this.authService.generateToken(user);

            // Call your auth service if needed
            this.authService.login({
                email: user.email,
                password: req.body.password as string
            })
                .then(loginResponse => {
                    const response: ApiResponse = {
                        success: true,
                        data: {
                            ...loginResponse,
                            token,
                            token_type: 'Bearer',
                            expires_in: 3600
                        },
                        message: 'Login successful'
                    };
                    res.status(200).json(response);
                })
                .catch(error => next(error));
        };

        const authMiddleware = passport.authenticate('local', {
            session: false,
            failWithError: true
        }, handleAuth);

        authMiddleware(req, res, next);
    }

    /**
     * Get current user profile
     * @param req Authenticated request object
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the authenticated user's profile
     * @throws Error if user is not authenticated
     */
    @Get('/profile')
    @UseMiddleware(authMiddleware({ roles: ['admin'] }))
    public getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): void {

        // Call the auth service to get the user profile
        this.authService.getProfile(req.user?.id as string)
            .then(user => {
                const { password, ...userWithoutPassword } = user;
                const response: ApiResponse = {
                    success: true,
                    data: userWithoutPassword
                };
                res.status(200).json(response);
            })
            .catch(error => {
                next(error);
            });
    }

    /**
     * User logout
     * @param req Request object
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns success message
     */
    /**
     * Logout endpoint
     * @param req Request object
     * @param res Response object
     * @param next Next function for error handling
     */
    @Post('/logout')
    public logout(req: Request, res: Response, next: NextFunction): void {
        req.logout((err: Error) => {
            if (err) {
                return next(err);
            }

            // Clear the session cookie
            res.clearCookie('connect.sid');

            const response: ApiResponse = {
                success: true,
                message: 'Logout successful'
            };

            res.status(200).json(response);

            return undefined;
        });
    }
}