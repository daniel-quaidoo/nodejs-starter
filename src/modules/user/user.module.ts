// service
import { UserService } from './service/user.service';

// module
import { Module } from '../../core/common/di/module.decorator';

// repository
import { UserRepository } from './repository/user.repository';

// controller
import { UserController } from './controller/user.controller';

@Module({
    services: [UserService],
    controllers: [UserController],
    repositories: [UserRepository],
    exports: [UserService],
})
export class UserModule {}
