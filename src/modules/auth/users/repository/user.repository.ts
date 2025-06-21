import Container from 'typedi';
import { DataSource, FindOptionsWhere, IsNull, Not } from 'typeorm';

// model
import { User } from '../entities/user.entity';

// dao
import { BaseDAO } from '../../../../core/common/dao/base.dao';

// interface
import { IUserRepository } from '../interfaces/user.interface';

// decorator
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class UserRepository extends BaseDAO<User> implements IUserRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, User);
    }

    async findByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: {
                email,
                deletedAt: IsNull(),
            } as FindOptionsWhere<User>,
        });
        return user;
    }

    async findActiveUsers(): Promise<User[]> {
        const users = await this.repository.find({
            where: {
                isActive: true,
                deletedAt: IsNull(),
            } as FindOptionsWhere<User>,
        });
        return users;
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const query: FindOptionsWhere<User> = {
            email,
            deletedAt: IsNull(),
        };

        if (excludeId) {
            query.userId = Not(excludeId) as any;
        }

        const count = await this.repository.count({ where: query });
        return count > 0;
    }

    async findUserWithRoles(userId: string): Promise<User | null> {
        return this.repository.findOne({
            where: { userId },
            relations: ['roles']
        });
    }

    async removeRoleFromUser(userId: string, roleId: string): Promise<User> {
        const user = await this.findUserWithRoles(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.roles = user.roles.filter(role => role.role_id !== roleId);
        return this.save(user);
    }

    async addRolesToUser(userId: string, roleIds: string[]): Promise<User> {
        const user = await this.findUserWithRoles(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const existingRoleIds = user.roles.map(role => role.role_id.toString());
        const newRoleIds = roleIds.filter(id => !existingRoleIds.includes(id));

        if (newRoleIds.length > 0) {
            const roleRepository = this.repository.manager.getRepository('Role');
            const rolesToAdd = await roleRepository.find({
                where: newRoleIds.map(id => ({
                    role_id: id
                }))
            });

            if (rolesToAdd.length > 0) {
                user.roles = [...user.roles, ...rolesToAdd as any];
                return this.save(user);
            }
        }
        return user;
    }
    
}