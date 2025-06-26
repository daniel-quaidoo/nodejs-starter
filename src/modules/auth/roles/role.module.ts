// service
import { RoleService } from './role.service';

// repository
import { RoleRepository } from './role.repository';

// controller
import { RoleController } from './role.controller';

// decorator
import { Module } from '../../../core/common/di/module.decorator';

@Module({
    repositories: [RoleRepository],
    services: [RoleService],
    controllers: [RoleController],
    exports: [],
})
export class RoleModule {}
