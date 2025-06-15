import { Container } from 'typedi';
import { DataSource, FindOptionsWhere, IsNull, Not } from 'typeorm';

// model
import { User } from '../entities/user.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

// interface
import { IUserRepository } from '../interfaces/user.interface';

// decorator
import { Component, COMPONENT_TYPE } from '../../../core/common/di/component.decorator';

@Component({ type: COMPONENT_TYPE.REPOSITORY })
export class UserRepository extends BaseDAO<User> implements IUserRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, User);
    }

    /**
     * Finds a user by email
     * @param email The email of the user to find
     * @returns The user with the given email, or null if not found
     */
    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: {
                email,
                deletedAt: IsNull(),
            } as FindOptionsWhere<User>,
        });
        return user;
    }

    /**
     * Finds all active users
     * @returns An array of active users
     */
    async findActiveUsers(): Promise<User[]> {
        const users = await this.repository.find({
            where: {
                isActive: true,
                deletedAt: IsNull(),
            } as FindOptionsWhere<User>,
        });
        return users;
    }

    /**
     * Checks if an email is taken
     * @param email The email to check
     * @param excludeId Optional ID to exclude from the check
     * @returns true if the email is taken, false otherwise
     */
    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const query: FindOptionsWhere<User> = {
            email,
            deletedAt: IsNull(),
        };

        if (excludeId) {
            query.id = Not(excludeId) as any;
        }

        const count = await this.repository.count({ where: query });
        return count > 0;
    }
}
