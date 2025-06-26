// model
import { Group } from './entities/group.entity';

// service
import { GroupService } from './group.service';

// dto
import { UserGroupDto } from './dto/user-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { UserGroupPermissionDto } from './dto/user-group-permissions.dto';

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

// exception
import {
    NotFoundException,
    BadRequestException,
} from '../../../core/common/exceptions/http.exception';

@Controller('/groups')
export class GroupController extends BaseController<Group> {
    constructor(private groupService: GroupService) {
        super(groupService);
    }

    @Post('')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async createGroup(@Body() body: CreateGroupDto): Promise<ApiResponse<Group>> {
        const dto = new CreateGroupDto();
        Object.assign(dto, body);

        const group = await this.groupService.create(dto.toContract() as Partial<Group>);
        return { success: true, data: group };
    }

    @Get('')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async findAllGroups(): Promise<ApiResponse<Group[]>> {
        const page = 1;
        const limit = 10;
        const result = await this.groupService.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            relations: ['permissions', 'userGroups'],
        });
        const [groups, count] = result;
        return {
            success: true,
            data: groups,
            meta: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit),
            },
        };
    }

    @Get(':groupId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async findOneGroup(@Param('groupId') groupId: string): Promise<ApiResponse<Group>> {
        const group = await this.groupService.findOne(groupId, {
            where: { groupId },
            relations: ['permissions'],
        });
        if (!group) throw new NotFoundException('Group not found');
        return { success: true, data: group };
    }

    @Patch(':groupId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async updateGroup(
        @Body() body: UpdateGroupDto,
        @Param('groupId') groupId: string
    ): Promise<ApiResponse<Group>> {
        const dto = new UpdateGroupDto();
        Object.assign(dto, body);

        const updatedGroup = await this.groupService.update(
            groupId,
            dto.toContract() as Partial<Group>
        );
        if (!updatedGroup) throw new NotFoundException('Group not found');
        return { success: true, data: updatedGroup };
    }

    @Delete(':groupId')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async removeGroup(@Param('groupId') groupId: string): Promise<ApiResponse<void>> {
        const result = await this.groupService.delete(groupId);
        if (!result) throw new NotFoundException('Group not found');
        return { success: true, message: 'Group deleted successfully' };
    }

    @Post(':groupId/users')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async addUsersToGroup(
        @Param('groupId') groupId: string,
        @Body() body: { user_group_id: string[] }
    ): Promise<ApiResponse<UserGroupDto[]>> {
        if (
            !body ||
            !body.user_group_id ||
            !Array.isArray(body.user_group_id) ||
            body.user_group_id.length === 0
        ) {
            throw new BadRequestException('User IDs array is required');
        }

        const userGroups = await this.groupService.addUsersToGroup(groupId, body.user_group_id);
        return {
            success: true,
            data: userGroups.map(ug => UserGroupDto.fromContract(ug)),
            message: 'Users added to group successfully',
        };
    }

    @Get(':groupId/users')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async getUsersInGroup(@Param('groupId') groupId: string): Promise<ApiResponse<UserGroupDto[]>> {
        const userGroups = await this.groupService.getUsersInGroup(groupId);
        return {
            success: true,
            data: userGroups.map(userGroup => UserGroupDto.fromContract(userGroup)),
        };
    }

    @Delete(':groupId/users')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async removeUsersFromGroup(
        @Param('groupId') groupId: string,
        @Body() body: { user_group_id: string[] }
    ): Promise<ApiResponse<void>> {
        if (
            !body ||
            !body.user_group_id ||
            !Array.isArray(body.user_group_id) ||
            body.user_group_id.length === 0
        ) {
            throw new BadRequestException('User IDs array is required');
        }

        await this.groupService.removeUsersFromGroup(groupId, body.user_group_id);
        return {
            success: true,
            message: 'Users removed from group successfully',
        };
    }

    @Post(':groupId/permissions')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async addPermissionsToGroup(
        @Param('groupId') groupId: string,
        @Body() body: { permission_id: string[] }
    ): Promise<ApiResponse<UserGroupPermissionDto[]>> {
        if (
            !body ||
            !body.permission_id ||
            !Array.isArray(body.permission_id) ||
            body.permission_id.length === 0
        ) {
            throw new BadRequestException('Permission IDs array is required');
        }

        const permissions = await this.groupService.addPermissionsToGroup(
            groupId,
            body.permission_id
        );
        return {
            success: true,
            data: permissions.map(p => UserGroupPermissionDto.fromContract(p)),
            message: 'Permissions added to group successfully',
        };
    }

    @Get(':groupId/permissions')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async getGroupPermissions(
        @Param('groupId') groupId: string
    ): Promise<ApiResponse<UserGroupPermissionDto[]>> {
        const permissions = await this.groupService.getGroupPermissions(groupId);
        return {
            success: true,
            data: permissions.map(permission => UserGroupPermissionDto.fromContract(permission)),
        };
    }

    @Delete(':groupId/permissions')
    @UseMiddleware(authMiddleware({ roles: ['ADMIN'] }))
    async removePermissionsFromGroup(
        @Param('groupId') groupId: string,
        @Body() body: { permission_id: string[] }
    ): Promise<ApiResponse<void>> {
        if (
            !body ||
            !body.permission_id ||
            !Array.isArray(body.permission_id) ||
            body.permission_id.length === 0
        ) {
            throw new BadRequestException('Permission IDs array is required');
        }

        await this.groupService.removePermissionsFromGroup(groupId, body.permission_id);
        return {
            success: true,
            message: 'Permissions removed from group successfully',
        };
    }
}
