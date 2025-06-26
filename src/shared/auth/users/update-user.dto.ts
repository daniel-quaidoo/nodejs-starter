// enum
import { Gender } from './enums/gender.enum';

// dto
import { RoleContractDto } from '../roles/role.dto';
import { ContactContractDto } from '../contacts/contact.dto';
import { UserGroupContractDto } from '../groups/user-group.dto';
import { CreateRoleContractDto } from '../roles/create-role.dto';
import { CreateContactDto } from '../contacts/create-contact.dto';
import { CreateUserGroupDto } from '../groups/create-user-group.dto';

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
    roles?: CreateRoleContractDto[] | RoleContractDto[] | string[];
    userGroups?: CreateUserGroupDto[] | UserGroupContractDto[] | string[];
    contacts?: CreateContactDto[] | ContactContractDto[] | string[];
}
