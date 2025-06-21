// service
import { RoleService } from './role.service';

// repository
import { RoleRepository } from './role.repository';

// decorator
import { Module } from '../../../core/common/di/module.decorator';

@Module({
    repositories: [RoleRepository],
    services: [RoleService],
    exports: [],
})
export class RoleModule {}
