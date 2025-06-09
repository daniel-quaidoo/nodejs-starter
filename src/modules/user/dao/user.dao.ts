import { DataSource } from 'typeorm';

// model
import { User } from '../entities/user.entity';

// dao
import { BaseDAO } from '../../../core/common/dao/base.dao';

export class UserDAO extends BaseDAO<User> {
    constructor(dataSource: DataSource) {
        super(dataSource, User);
    }
}
