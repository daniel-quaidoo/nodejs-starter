// enum
import { Gender } from './enums/gender.enum';

// dto
import { CreateRoleContractDto } from '../roles/create-role.dto';
import { CreateContactDto } from '../contacts/create-contact.dto';
import { CreateUserGroupDto } from '../groups/create-user-group.dto';
import { RoleDto } from '../roles/role.dto';
import { UserGroupDto } from '../groups/user-group.dto';
import { ContactDto } from '../contacts/contact.dto';

export class UpdateUserContractDto {
    userId?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    is_active?: boolean;
    identificationNumber?: string;
    photoUrl?: string;
    gender?: Gender;
    dateOfBirth?: Date;
    roles?: CreateRoleContractDto[] | RoleDto[] | string[];
    userGroups?: CreateUserGroupDto[] | UserGroupDto[] | string[];
    contacts?: CreateContactDto[] | ContactDto[] | string[];
}
