// dto
import { GroupContractDto } from './group.dto';
import { UserContractDto } from '../users/user.dto';

export class CreateUserGroupDto {
    user: UserContractDto;
    group: GroupContractDto;
    isActive: boolean;
    created_at: Date;
    updated_at: Date;
}
