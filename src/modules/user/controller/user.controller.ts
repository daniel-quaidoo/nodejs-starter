import { Inject } from 'typedi';
import { Request, Response, NextFunction } from 'express';

// model
import { User } from '../entities/user.entity';

// service
import { UserService } from '../service/user.service';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// decorator
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';
import { Controller, Delete, Get, Post, Put } from "../../../core/common/decorators/route.decorator";

@Controller('/users')
@UseMiddleware(authMiddleware({ roles: ['admin'] }))
export class UserController extends BaseController<User> {

    constructor(@Inject() private userService: UserService) {
        super(userService);
    }

    /**
     * Get paginated list of all users
     * @param req Request object containing query parameters:
     *   - page: Current page number (default: 1)
     *   - limit: Number of items per page (default: 10)
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns a paginated list of users with metadata
     * @throws Error if database operation fails
     */
    @Get('/all')
    // @UseMiddleware(authMiddleware({ roles: ['admin'] }))
    public async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { page = 1, limit = 10 } = req.query;
            const result = await this.userService.findAndCount({
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
                ...req.query
            });

            const [users, count] = result;
            
            const response: ApiResponse<User[]> = {
                success: true,
                data: users,
                meta: {
                    page: Number(page),
                    limit: Number(limit),
                    total: count,
                    totalPages: Math.ceil(count / Number(limit))
                }
            };
            
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get a single user by ID
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the requested user
     * @throws Error if user is not found or database operation fails
     */
    @Get('/:id')
    public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.findOne(req.params.id);

            if (!user) {
                throw new Error('User not found');
            }
            const response: ApiResponse<User> = {
                success: true,
                data: user
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create a new user
     * @param req Request object containing user data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the created user
     * @throws Error if user creation fails
     */
    @Post('/')
    public async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.create(req.body);
            const response: ApiResponse<User> = {
                success: true,
                data: user,
                message: 'User created successfully'
            };
            res.status(201).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Update an existing user
     * @param req Request object containing user ID in params and update data in body
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns the updated user
     * @throws Error if user is not found or update fails
     */
    @Put('/:id')
    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.updateUser(req.params.id, req.body);

            if (!user) {
                throw new Error('User not found');
            }

            const response: ApiResponse<User> = {
                success: true,
                data: user,
                message: 'User updated successfully'
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Delete a user
     * @param req Request object containing user ID in params
     * @param res Response object
     * @param next Next function
     * @returns Promise<void> - Returns success message
     * @throws Error if user deletion fails
     */
    @Delete('/:id')
    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.userService.delete(req.params.id);
            const response: ApiResponse<void> = {
                success: true,
                message: 'User deleted successfully'
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}