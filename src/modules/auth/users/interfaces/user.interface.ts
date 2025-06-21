// entity
import { User } from '../entities/user.entity'

// interface
import { IBaseRepository } from '@/core/common/interfaces/base.repository.interface';

/**
 * Interface for user repository
 * @extends IBaseRepository<User>
 */
export interface IUserRepository extends IBaseRepository<User> {
    findActiveUsers(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    findUserWithRoles(userId: string): Promise<User | null>;
    addRolesToUser(userId: string, roleIds: string[]): Promise<User>;
    removeRoleFromUser(userId: string, roleId: string): Promise<User>;
    isEmailTaken(email: string, excludeId?: string): Promise<boolean>;
}
