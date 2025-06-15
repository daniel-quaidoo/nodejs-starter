// service
import { AuthService } from './service/auth.service';

// controller
import { AuthController } from './controller/auth.controller';

// decorator
import { Module } from '../../core/common/di/module.decorator';

@Module({
    services: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
