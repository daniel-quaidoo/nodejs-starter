// model
import { User } from './entities/user.entity';

//service
import { UserService } from './service/user.service';

//dto
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// exception
import { BadRequestException } from '../../../core/common/exceptions/http.exception';

// decorator
import { Body, Param } from '../../../core/common/decorators/param.decorator';
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';
import { Controller, Post, Get, Delete, Patch } from '../../../core/common/decorators/route.decorator';

@Controller('/users')
export class UserController extends BaseController<User> {
    constructor(private readonly userService: UserService) { super(userService) }

    @Post('')
    public async createUser(@Body() body: CreateUserDto): Promise<ApiResponse<User>> {
        const dto = new CreateUserDto();
        Object.assign(dto, body);

        const user = await this.userService.createUser(dto.toContract());

        const response: ApiResponse<User> = {
            success: true,
            data: user
        };

        return response;
    }

    @Get('')
    @UseMiddleware(authMiddleware({ roles: ['USER'] }))
    public async findAllUsers(): Promise<ApiResponse<User[]>> {

        const page = 1;
        const limit = 10;

        const result = await this.userService.findAndCount({
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            relations: ['roles']
        });

        const [users, count] = result;

        const response: ApiResponse<User[]> = {
            success: true,
            data: users,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                totalPages: Math.ceil(count / Number(limit)),
            },
        };

        return response;
    }

    @Get(':userId')
    public async findOneUser(@Param('userId') userId: string): Promise<ApiResponse<User>> {
        const user = await this.userService.findOne({ where: { userId } })

        const response: ApiResponse<User> = {
            success: true,
            data: user,
        };

        return response;
    }

    @Patch(':userId')
    public async updateUser(
        @Body() body: UpdateUserDto,
        @Param('userId') userId: string,
    ): Promise<ApiResponse<User>> {
        if (!body || Object.keys(body).length === 0) {
            throw new BadRequestException('No update data provided');
        }

        // Convert the DTO to a contract object
        const dto = new UpdateUserDto();
        Object.assign(dto, body);
        const updateData = dto.toContract();

        const user = await this.userService.updateUser(userId, updateData);

        const response: ApiResponse<User> = {
            success: true,
            data: user,
            message: 'User updated successfully'
        };

        return response;
    }

    @Delete('/:userId')
    public async deleteUser(@Param('userId') userId: string): Promise<ApiResponse<void>> {
        try {
            await this.userService.delete(userId);

            const response: ApiResponse<void> = {
                success: true,
                message: 'User deleted successfully',
            };

            return response;
        } catch (error) {
            throw new BadRequestException(error as any);
        }
    }

    @Post(':userId/roles')
    public async assignRoles(
        @Param('userId') userId: string,
        @Body() dto: AssignRoleDto,
    ): Promise<ApiResponse<User>> {
        const user = await this.userService.assignRoleToUser(userId, dto.role_ids)

        const response: ApiResponse<User> = {
            success: true,
            data: user,
        };

        return response;
    }

    @Delete(':userId/roles/:roleId')
    public async removeRole(
        @Param('userId') userId: string,
        @Param('roleId') roleId: string,
    ): Promise<ApiResponse<void>> {
        await this.userService.removeRoleFromUser(userId, roleId)

        const response: ApiResponse<void> = {
            success: true,
            message: 'Role removed successfully',
        };

        return response;
    }
}
