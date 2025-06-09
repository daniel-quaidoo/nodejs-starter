import { Inject } from 'typedi';
import { Request, Response, NextFunction } from 'express';

// models
import { User } from '../entities/user.entity';

// service
import { UserService } from '../service/user.service';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// decorator
import { Component, COMPONENT_TYPE } from "../../../core/common/di/component.decorator";

@Component({ type: COMPONENT_TYPE.CONTROLLER })
export class UserController extends BaseController<User> {

    constructor(@Inject() private userService: UserService) {
        super(userService);
    }

    /**
     * Find all users with pagination (overrides base method)
     */
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
     * Get user by ID (legacy method - kept for backward compatibility)
     */
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
     */
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
     * Update user by ID
     */
    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user = await this.userService.update(req.params.id, req.body);

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
     * Delete user by ID (soft delete)
     */
    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.userService.delete(req.params.id);

            const response: ApiResponse<null> = {
                success: true,
                message: 'User deleted successfully'
            };
            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
}