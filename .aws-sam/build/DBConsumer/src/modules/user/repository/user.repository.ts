import { Container } from 'typedi';
import { DataSource, FindOptionsWhere, IsNull, Not } from 'typeorm';

// model
import { User } from '../entities/user.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

// interface
import { IUserRepository } from '../interfaces/user.interface';

// decorator
import { Component, COMPONENT_TYPE } from "../../../core/common/di/component.decorator";


@Component({ type: COMPONENT_TYPE.REPOSITORY })
export class UserRepository extends BaseDAO<User> implements IUserRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, User);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ 
            where: { 
                email,
                deletedAt: IsNull()
            } as FindOptionsWhere<User>
        });
    }

    async findActiveUsers(): Promise<User[]> {
        return this.repository.find({ 
            where: { 
                isActive: true,
                deletedAt: IsNull()
            } as FindOptionsWhere<User>
        });
    }

    async isEmailTaken(email: string, excludeId?: string): Promise<boolean> {
        const query: FindOptionsWhere<User> = { 
            email,
            deletedAt: IsNull()
        };
        
        if (excludeId) {
            query.id = Not(excludeId) as any;
        }

        const count = await this.repository.count({ where: query });
        return count > 0;
    }
}