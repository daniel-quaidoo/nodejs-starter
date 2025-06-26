import { Module } from '../../../core/common/di/module.decorator';

import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';
import { PermissionController } from './permission.controller';

@Module({
    controllers: [PermissionController],
    repositories: [PermissionRepository],
    services: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule {}
