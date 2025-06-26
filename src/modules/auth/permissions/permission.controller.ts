// model
import { Permission } from './entities/permission.entity';

// service
import { PermissionService } from './permission.service';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// dto
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

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

@Controller('/permissions')
export class PermissionController extends BaseController<Permission> {
    constructor(private permissionService: PermissionService) {
        super(permissionService);
    }

    @Post('')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async createPermission(@Body() body: CreatePermissionDto): Promise<ApiResponse<Permission>> {
        const dto = new CreatePermissionDto();
        Object.assign(dto, body);

        const permission = await this.permissionService.create(
            dto.toContract() as Partial<Permission>
        );
        return { success: true, data: permission };
    }

    @Get('')
    async findAllPermissions(): Promise<ApiResponse<Permission[]>> {
        const page = 1;
        const limit = 10;
        const result = await this.permissionService.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['roles', 'groups'],
        });
        const [permissions, count] = result;
        return {
            success: true,
            data: permissions,
            meta: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    @Get(':permissionId')
    async findOnePermission(
        @Param('permissionId') permissionId: string
    ): Promise<ApiResponse<Permission>> {
        const permission = await this.permissionService.findOne(permissionId, {
            where: { permissionId },
            relations: ['roles', 'groups'],
        });
        if (!permission) throw new NotFoundException('Permission not found');
        return { success: true, data: permission };
    }

    @Patch(':permissionId')
    async updatePermission(
        @Body() body: UpdatePermissionDto,
        @Param('permissionId') permissionId: string
    ): Promise<ApiResponse<Permission>> {
        const dto = new UpdatePermissionDto();
        Object.assign(dto, body);

        const updatedPermission = await this.permissionService.update(
            permissionId,
            dto.toContract() as Partial<Permission>
        );
        if (!updatedPermission) throw new NotFoundException('Permission not found');
        return { success: true, data: updatedPermission };
    }

    @Delete(':permissionId')
    async removePermission(
        @Param('permissionId') permissionId: string
    ): Promise<ApiResponse<void>> {
        const result = await this.permissionService.delete(permissionId);
        if (!result) throw new NotFoundException('Permission not found');
        return { success: true, message: 'Permission deleted successfully' };
    }
}
