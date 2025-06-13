import { Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';

// models
import { User } from '../../user/entities/user.entity';

// service
import { AuthService } from '../service/auth.service';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// decorator
import { Component, COMPONENT_TYPE } from "../../../core/common/di/component.decorator";
import { Controller, Get, Post, getRouteMetadata } from "../../../core/common/decorators/route.decorator";

// dto
import { LoginDto } from '../dto/login.dto';

// types
import { AuthenticatedRequest } from '../types';

@Component({ type: COMPONENT_TYPE.CONTROLLER })
@Controller('/auth')
export class AuthController extends BaseController<any> {
    public router: Router;

    constructor(@Inject() private authService: AuthService) {
        super(authService as any);
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        const routes = getRouteMetadata(AuthController);
        
        routes.forEach(route => {
            const handler = (req: Request, res: Response, next: NextFunction) => {
                return (this as any)[route.handlerName](req, res, next);
            };

            switch (route.method) {
                case 'GET':
                    this.router.get(route.path, handler);
                    break;
                case 'POST':
                    this.router.post(route.path, handler);
                    break;
                case 'PUT':
                    this.router.put(route.path, handler);
                    break;
                case 'DELETE':
                    this.router.delete(route.path, handler);
                    break;
            }
        });
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

            req.login(user, (loginErr?: Error) => {
                if (loginErr) {
                    next(loginErr);
                    return;
                }

                this.authService.login({
                    email: user.email,
                    password: req.body.password as string
                })
                .then(loginResponse => {
                    const response: ApiResponse = {
                        success: true,
                        data: loginResponse,
                        message: 'Login successful'
                    };
                    res.status(200).json(response);
                })
                .catch(error => next(error));
            });
        };

        const authMiddleware = passport.authenticate('local', handleAuth);
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
    public getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
        if (!req.user) {
            const response: ApiResponse = {
                success: false,
                message: 'Not authenticated'
            };
            res.status(401).json(response);
            return;
        }

        // Call the auth service to get the user profile
        this.authService.getProfile(req.user.id)
            .then(user => {
                // Create a response without the password field
                const { password, ...userWithoutPassword } = user;
                const response: ApiResponse = {
                    success: true,
                    data: userWithoutPassword
                };
                // Send the response
                res.status(200).json(response);
            })
            .catch(error => {
                // Pass any errors to the error handler
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