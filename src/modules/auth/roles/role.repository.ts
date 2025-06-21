import Container from 'typedi';
import { DataSource, In } from 'typeorm';

// model
import { Role } from './entities/role.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

// interface
import { IRoleRepository } from './interfaces/role.interface';

// decorator
import { Repository } from '../../../core/common/di/component.decorator';

@Repository()
export class RoleRepository extends BaseDAO<Role> implements IRoleRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Role);
    }

    public findRolesByIds(roleIds: number[]): Promise<Role[] | []> {
        if (!roleIds.length) return Promise.resolve([]);

        return this.repository.find({
            where: {
                role_id: In(roleIds),
            },
        });
    }
}
