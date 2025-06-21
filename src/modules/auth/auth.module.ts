// module
import { UserModule } from './users/user.module';

// controller
import { AuthController } from './auth.controller';

// decorator
import { Module } from '../../core/common/di/module.decorator';

// service
import { AuthService } from './auth.service';
import { UserCredsService } from './users/service/user-creds.service';
import { TokenBlacklistService } from './core/token-blacklist.service';

// repository
import { UserCredsRepository } from './users/repository/user-creds.repository';

@Module({
    services: [TokenBlacklistService, UserCredsService, AuthService],
    controllers: [AuthController],
    repositories: [UserCredsRepository],
    imports: [UserModule],
})
export class AuthModule {}
