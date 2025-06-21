
import Container from "typedi";
import { DataSource } from "typeorm";

// dao
import { BaseDAO } from "../../../../core/common/dao/base.dao";

// entity
import { UserCredentials } from "../entities/user-credentials.entity";


// decorator
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class UserCredsRepository extends BaseDAO<UserCredentials> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, UserCredentials);
    }
}
