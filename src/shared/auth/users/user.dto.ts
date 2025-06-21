// enum
import { Gender } from './enums/gender.enum';

// dto
import { RoleDto } from '../roles/role.dto';
import { ContactDto } from '../contacts/contact.dto';
import { UserCredentialsDto } from './user-creds.dto';
import { UserGroupDto } from '../groups/user-group.dto';
import { CreateRoleDto } from '../roles/create-role.dto';
import { CreateUserGroupDto } from '../groups/create-user-group.dto';
import { CreateContactDto } from '../contacts/create-contact.dto';

export class UserDto {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    identificationNumber: string;
    photoUrl: string;
    gender: Gender;
    dateOfBirth: Date;
    roles: CreateRoleDto[] | RoleDto[] | string[];
    userGroups: CreateUserGroupDto[] | UserGroupDto[] | string[];
    contacts: CreateContactDto[] | ContactDto[] | string[];
    credentials?: UserCredentialsDto;
}