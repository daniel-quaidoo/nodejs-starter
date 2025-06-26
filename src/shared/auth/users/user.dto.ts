// enum
import { Gender } from './enums/gender.enum';

// dto
import { RoleContractDto } from '../roles/role.dto';
import { ContactContractDto } from '../contacts/contact.dto';
import { UserCredentialsDto } from './user-creds.dto';
import { UserGroupContractDto } from '../groups/user-group.dto';
import { CreateRoleContractDto } from '../roles/create-role.dto';
import { CreateUserGroupDto } from '../groups/create-user-group.dto';
import { CreateContactDto } from '../contacts/create-contact.dto';

export class UserContractDto {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    identificationNumber: string;
    photoUrl: string;
    gender: Gender;
    dateOfBirth: Date;
    roles: CreateRoleContractDto[] | RoleContractDto[] | string[];
    userGroups: CreateUserGroupDto[] | UserGroupContractDto[] | string[];
    contacts: CreateContactDto[] | ContactContractDto[] | string[];
    credentials?: UserCredentialsDto;
}
