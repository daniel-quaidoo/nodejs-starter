import { Inject } from 'typedi';
import { DeepPartial, In } from 'typeorm';

// service
import { BaseService } from '../../../core/common';

// entity
import { Role } from './entities/role.entity';
import { Permission } from '../permissions/entities/permission.entity';

// repository
import { RoleRepository } from './role.repository';
import { PermissionService } from '../permissions/permission.service';

// decorator
import { Service } from '../../../core/common/di/component.decorator';

// dto
import { CreateRoleContractDto } from '../../../shared/auth/roles/create-role.dto';
import { UpdateRoleContractDto } from '../../../shared/auth/roles/update-role.dto';

// exception
import {
    NotFoundException,
    ConflictException,
} from '../../../core/common/exceptions/http.exception';

@Service()
export class RoleService extends BaseService<Role> {
    constructor(
        @Inject() private roleRepository: RoleRepository,
        @Inject() private permissionService: PermissionService
    ) {
        super(roleRepository);
    }

    public async createRole(role: Role | CreateRoleContractDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ where: { name: role.name } });

        if (existingRole) {
            throw new ConflictException(`Role with name ${role.name} already exists`);
        }

        let permissions: Permission[] = [];
        if ('permissions' in role && role.permissions && role.permissions.length > 0) {
            if (typeof role.permissions[0] === 'object') {
                permissions = await Promise.all(
                    role.permissions.map(permissionData =>
                        this.permissionService.create(permissionData as Partial<Permission>)
                    )
                );
            } else if (typeof role.permissions[0] === 'string') {
                const permissionNames = (role.permissions as unknown[]).filter(
                    (p): p is string => typeof p === 'string'
                );
                if (permissionNames.length > 0) {
                    permissions = await this.permissionService.findAll({
                        where: { name: In(permissionNames) },
                    });
                }
            }
        }

        // Create the role with the associated permissions
        const newRole = await this.roleRepository.create({
            ...role,
            permissions,
        } as DeepPartial<Role>);

        return this.roleRepository.save(newRole);
    }

    public findRoleById(roleId: string): Promise<Role | null> {
        const role = this.roleRepository.findOne({ where: { role_id: roleId } });

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        return role;
    }

    public findRolesByIds(roleIds: string[]): Promise<Role[]> {
        return this.roleRepository.find({ where: { role_id: In(roleIds) } });
    }

    async updateRole(
        roleId: string,
        role: UpdateRoleContractDto | DeepPartial<Role>
    ): Promise<Role | null> {
        const existingRole = await this.roleRepository.findOne({ where: { role_id: roleId } });

        if (!existingRole) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        const updatedRole = await this.roleRepository.update(roleId, role as DeepPartial<Role>);

        if (!updatedRole) throw new NotFoundException('Role not found');

        return updatedRole;
    }

    async deleteRole(roleId: string): Promise<void> {
        const role = await this.roleRepository.findOne({ where: { role_id: roleId } });

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        await this.roleRepository.softDelete(role.role_id);
    }
}
