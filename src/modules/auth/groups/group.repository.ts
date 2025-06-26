import { Inject } from 'typedi';
import { DataSource, Repository as TypeORMRepository } from 'typeorm';

// entity
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { UserGroupPermission } from './entities/user-group-permissions.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

// decorator
import { Repository } from '../../../core/common/di/component.decorator';

@Repository()
export class GroupRepository extends BaseDAO<Group> {
    private userRepository: TypeORMRepository<User>;
    private userGroupRepository: TypeORMRepository<UserGroup>;
    private permissionRepository: TypeORMRepository<Permission>;
    private userGroupPermissionRepository: TypeORMRepository<UserGroupPermission>;

    constructor(@Inject('DataSource') dataSource: DataSource) {
        super(dataSource, Group);
        this.userRepository = dataSource.getRepository(User);
        this.userGroupRepository = dataSource.getRepository(UserGroup);
        this.permissionRepository = dataSource.getRepository(Permission);
        this.userGroupPermissionRepository = dataSource.getRepository(UserGroupPermission);
    }

    findUserInGroup(groupId: string, userId: string): Promise<UserGroup | null> {
        return this.userGroupRepository.findOne({
            where: {
                group: { groupId },
                user: { userId },
            },
            relations: ['user', 'group'],
        });
    }

    findUsersInGroup(groupId: string): Promise<UserGroup[]> {
        return this.userGroupRepository.find({
            where: { group: { groupId } },
            relations: ['user', 'group'],
        });
    }

    async findGroupPermissions(groupId: string): Promise<UserGroupPermission[]> {
        const permissions = await this.userGroupPermissionRepository.find({
            where: { group: { groupId } },
            relations: ['permission', 'group', 'user', 'grantedBy'],
        });

        return permissions;
    }

    findGroupPermission(
        groupId: string,
        permissionId: string
    ): Promise<UserGroupPermission | null> {
        return this.userGroupPermissionRepository.findOne({
            where: {
                group: { groupId },
                permission: { permissionId },
            },
            relations: ['group', 'permission'],
        });
    }

    createUserGroup(userGroup: Partial<UserGroup>): Promise<UserGroup> {
        const newUserGroup = this.userGroupRepository.create(userGroup);
        return this.userGroupRepository.save(newUserGroup);
    }

    createGroupPermission(
        permission: Partial<UserGroupPermission>
    ): Promise<UserGroupPermission> {
        const newPermission = this.userGroupPermissionRepository.create(permission);
        return this.userGroupPermissionRepository.save(newPermission);
    }

    async removeUserFromGroup(groupId: string, userId: string): Promise<boolean> {
        const result = await this.userGroupRepository.delete({
            group: { groupId },
            user: { userId },
        });
        return (result.affected || 0) > 0;
    }

    async removePermissionFromGroup(groupId: string, permissionId: string): Promise<boolean> {
        const result = await this.userGroupPermissionRepository.delete({
            group: { groupId },
            permission: { permissionId },
        });
        return (result.affected || 0) > 0;
    }

    findUserById(userId: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { userId } });
    }

    findGroupById(groupId: string): Promise<Group | null> {
        return this.findOne({ where: { groupId } });
    }

    findPermissionById(permissionId: string): Promise<Permission | null> {
        return this.permissionRepository.findOne({ where: { permissionId } });
    }
}
