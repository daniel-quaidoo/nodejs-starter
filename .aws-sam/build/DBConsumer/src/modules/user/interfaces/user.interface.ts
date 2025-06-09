// entity
import { User } from '../entities/user.entity';

// interface
import { IBaseRepository } from '../../../core/common/interfaces/base.repository.interface';

export interface IUserRepository extends IBaseRepository<User> {
    findActiveUsers(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    isEmailTaken(email: string, excludeId?: string): Promise<boolean>;
}
