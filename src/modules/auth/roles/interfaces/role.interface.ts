// entity
import { Role } from '../entities/role.entity'

// interface
import { IBaseRepository } from '@/core/common/interfaces/base.repository.interface';

/**
 * Interface for role repository
 * @extends IBaseRepository<Role>
 */
export interface IRoleRepository extends IBaseRepository<Role> {
    findRolesByIds(roleIds: number[]): Promise<Role[]>;
}
