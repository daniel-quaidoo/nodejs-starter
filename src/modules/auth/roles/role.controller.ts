// model
import { Role } from './entities/role.entity';

// service
import { RoleService } from './role.service';

// dto
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// interface
import { ApiResponse } from '../../../core/common/interfaces/route.interface';

// controller
import { BaseController } from '../../../core/common/controller/base.controller';

// decorator
import { Body, Param } from '../../../core/common/decorators/param.decorator';
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';
import {
    Controller,
    Post,
    Get,
    Delete,
    Patch,
} from '../../../core/common/decorators/route.decorator';
import { NotFoundException } from '../../../core/common/exceptions/http.exception';

@Controller('/roles')
export class RoleController extends BaseController<Role> {
    constructor(private readonly roleService: RoleService) {
        super(roleService);
    }

    @Post('')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    public async createRole(@Body() body: CreateRoleDto): Promise<ApiResponse<Role>> {
        const dto = new CreateRoleDto();
        Object.assign(dto, body);

        const role = await this.roleService.createRole(dto.toContract());

        const response: ApiResponse<Role> = {
            success: true,
            data: role,
        };

        return response;
    }

    @Get('')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    public async findAllRoles(): Promise<ApiResponse<Role[]>> {
        const page = 1;
        const limit = 10;

        const result = await this.roleService.findAndCount({
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit),
            relations: ['permissions'],
        });

        const [roles, count] = result;

        const response: ApiResponse<Role[]> = {
            success: true,
            data: roles,
            meta: {
                page: Number(page),
                limit: Number(limit),
                total: count,
                totalPages: Math.ceil(count / Number(limit)),
            },
        };

        return response;
    }

    @Get(':roleId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    public async findOneRole(@Param('roleId') roleId: string): Promise<ApiResponse<Role>> {
        const role = await this.roleService.findOne(roleId, {
            where: { role_id: roleId },
            relations: ['permissions'],
        });

        if (!role) throw new NotFoundException('Role not found');

        const response: ApiResponse<Role> = {
            success: true,
            data: role,
        };

        return response;
    }

    @Patch(':roleId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    public async updateRole(
        @Body() body: UpdateRoleDto,
        @Param('roleId') roleId: string
    ): Promise<ApiResponse<Role>> {
        const dto = new UpdateRoleDto();
        Object.assign(dto, body);

        const updatedRole = await this.roleService.updateRole(roleId, dto.toContract());

        if (!updatedRole) throw new NotFoundException('Role not found');

        const response: ApiResponse<Role> = {
            success: true,
            data: updatedRole,
        };

        return response;
    }

    @Delete(':roleId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    public async removeRole(@Param('roleId') roleId: string): Promise<ApiResponse<void>> {
        await this.roleService.deleteRole(roleId);

        const response: ApiResponse<void> = {
            success: true,
            message: 'Role deleted successfully',
        };

        return response;
    }

    // @Post(':roleId/permissions')
    // @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    // public async assignPermissions(
    //     @Param('roleId') roleId: string,
    //     @Body('permissionIds') permissionIds: string[]
    // ): Promise<ApiResponse<Role>> {
    //     const role = await this.roleService.assignPermissions(roleId, permissionIds);

    //     const response: ApiResponse<Role> = {
    //         success: true,
    //         data: role,
    //         message: 'Permissions assigned successfully',
    //     };

    //     return response;
    // }
}
