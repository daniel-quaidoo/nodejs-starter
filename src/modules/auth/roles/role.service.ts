import { Inject } from 'typedi';
import { DeepPartial } from 'typeorm';

// entity
import { Role } from './entities/role.entity';

// service
import { BaseService } from '../../../core/common';

// repository
import { RoleRepository } from './role.repository';

// decorator
import { Service } from '../../../core/common/di/component.decorator';
import { In } from 'typeorm';

// exception
import { NotFoundException } from '../../../core/common/exceptions/http.exception';

// dto
import { CreateRoleContractDto } from '../../../shared/auth/roles/create-role.dto';

@Service()
export class RoleService extends BaseService<Role> {
    constructor(@Inject() private roleRepository: RoleRepository) {
        super(roleRepository);
    }

    public async createRole(role: Role | CreateRoleContractDto): Promise<Role> {
        const existingRole = await this.roleRepository.findOne({ where: { name: role.name } });

        if (existingRole) {
            throw new NotFoundException(`Role with name ${role.name} already exists`);
        }

        const newRole = await this.roleRepository.create(role as DeepPartial<Role>);

        return this.roleRepository.save(newRole);
    }

    public findRoleById(roleId: string): Promise<Role | null> {
        const role = this.roleRepository.findOne(roleId);

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        return role;
    }

    public findRolesByIds(roleIds: string[]): Promise<Role[]> {
        return this.roleRepository.find({ where: { role_id: In(roleIds) } });
    }

    async updateRole(roleId: string, role: Role): Promise<Role | null> {
        const existingRole = await this.roleRepository.findOne(roleId);

        if (!existingRole) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        const updatedRole = await this.roleRepository.update(roleId, role as DeepPartial<Role>);

        if (!updatedRole) throw new NotFoundException('Role not found');

        return updatedRole;
    }

    async deleteRole(roleId: string): Promise<void> {
        const role = await this.roleRepository.findOne(roleId);

        if (!role) {
            throw new NotFoundException(`Role with id ${roleId} not found`);
        }

        await this.roleRepository.softDelete(role.role_id);
    }
}
