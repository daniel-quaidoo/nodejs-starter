import { Inject } from 'typedi';

// entity
import { Permission } from './entities/permission.entity';

// service
import { BaseService } from '../../../core/common';

// repository
import { PermissionRepository } from './permission.repository';

// decorator
import { Service } from '../../../core/common/di/component.decorator';

@Service()
export class PermissionService extends BaseService<Permission> {
    constructor(@Inject() private permissionRepository: PermissionRepository) {
        super(permissionRepository);
    }
}
