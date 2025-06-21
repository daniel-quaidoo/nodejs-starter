import { Inject } from "typedi";

// service
import { BaseService } from "../../../../core/common";

// entity
import { UserCredentials } from "../entities/user-credentials.entity";

// decorator
import { Service } from "../../../../core/common/di/component.decorator";

// repository
import { UserCredsRepository } from "../repository/user-creds.repository";


@Service()
export class UserCredsService extends BaseService<UserCredentials> {
    constructor(
        @Inject() private userCredsRepository: UserCredsRepository
    ) {
        super(userCredsRepository);
    }
}
    