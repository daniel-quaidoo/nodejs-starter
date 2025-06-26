import { Module } from '../../../core/common/di/module.decorator';

import { GroupService } from './group.service';
import { GroupRepository } from './group.repository';
import { GroupController } from './group.controller';

@Module({
    controllers: [GroupController],
    repositories: [GroupRepository],
    services: [GroupService],
    exports: [GroupService],
})
export class GroupModule {}
