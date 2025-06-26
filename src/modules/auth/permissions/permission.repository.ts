import Container from 'typedi';
import { DataSource } from 'typeorm';

// entity
import { Permission } from './entities/permission.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

// decorator
import { Repository } from '../../../core/common/di/component.decorator';

@Repository()
export class PermissionRepository extends BaseDAO<Permission> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Permission);
    }
}
