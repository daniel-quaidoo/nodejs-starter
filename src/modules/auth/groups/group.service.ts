import { Inject } from 'typedi';

// entity
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupPermission } from './entities/user-group-permissions.entity';

// service
import { BaseService } from '../../../core/common';

// repository
import { GroupRepository } from './group.repository';

// decorator
import { Service } from '../../../core/common/di/component.decorator';
import { NotFoundException } from '../../../core/common/exceptions/http.exception';
import { BadRequestException } from '../../../core/common/exceptions/http.exception';

@Service()
export class GroupService extends BaseService<Group> {
    constructor(@Inject() private groupRepository: GroupRepository) {
        super(groupRepository);
    }

    async addUsersToGroup(
        groupId: string,
        userIds: string[],
        isActive: boolean = true
    ): Promise<UserGroup[]> {
        const results: UserGroup[] = [];
        for (const userId of userIds) {
            const userGroup = await this.addUserToGroup(groupId, userId, isActive);
            results.push(userGroup);
        }
        return results;
    }

    async removeUsersFromGroup(groupId: string, userIds: string[]): Promise<void> {
        for (const userId of userIds) {
            await this.removeUserFromGroup(groupId, userId);
        }
    }

    async addPermissionsToGroup(
        groupId: string,
        permissionIds: string[]
    ): Promise<UserGroupPermission[]> {
        const results: UserGroupPermission[] = [];
        for (const permissionId of permissionIds) {
            const permission = await this.addPermissionToGroup(groupId, permissionId);
            results.push(permission);
        }
        return results;
    }

    async removePermissionsFromGroup(groupId: string, permissionIds: string[]): Promise<void> {
        for (const permissionId of permissionIds) {
            await this.removePermissionFromGroup(groupId, permissionId);
        }
    }

    async addUserToGroup(
        groupId: string,
        userId: string,
        isActive: boolean = true
    ): Promise<UserGroup> {
        // Check if user is already in the group
        const existing = await this.groupRepository.findUserInGroup(groupId, userId);

        if (existing) {
            throw new BadRequestException('User is already in this group');
        }

        // Get user and group entities
        const user = await this.groupRepository.findUserById(userId);
        const group = await this.groupRepository.findGroupById(groupId);

        if (!user || !group) {
            throw new NotFoundException('User or Group not found');
        }

        return this.groupRepository.createUserGroup({
            user,
            group,
            isActive,
        });
    }

    getUsersInGroup(groupId: string): Promise<UserGroup[]> {
        return this.groupRepository.findUsersInGroup(groupId);
    }

    async removeUserFromGroup(groupId: string, userId: string): Promise<void> {
        const removed = await this.groupRepository.removeUserFromGroup(groupId, userId);
        if (!removed) {
            throw new NotFoundException('User not found in this group');
        }
    }

    async addPermissionToGroup(
        groupId: string,
        permissionId: string
    ): Promise<UserGroupPermission> {
        // Check if permission is already assigned
        const existing = await this.groupRepository.findGroupPermission(groupId, permissionId);

        if (existing) {
            throw new BadRequestException('Permission is already assigned to this group');
        }

        // Get group and permission entities
        const group = await this.groupRepository.findGroupById(groupId);
        const permission = await this.groupRepository.findPermissionById(permissionId);

        if (!group || !permission) {
            throw new NotFoundException('Group or Permission not found');
        }

        return this.groupRepository.createGroupPermission({
            group,
            permission,
        });
    }

    getGroupPermissions(groupId: string): Promise<UserGroupPermission[]> {
        return this.groupRepository.findGroupPermissions(groupId);
    }

    async removePermissionFromGroup(groupId: string, permissionId: string): Promise<void> {
        const removed = await this.groupRepository.removePermissionFromGroup(groupId, permissionId);
        if (!removed) {
            throw new NotFoundException('Permission not found for this group');
        }
    }
}
