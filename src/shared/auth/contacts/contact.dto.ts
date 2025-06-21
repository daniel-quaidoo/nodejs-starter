// dto
import { UserDto } from '../users/user.dto';

export class ContactDto {
    id: string;
    user: UserDto;
    first_name: string;
    last_name: string;
    email: string;
    relation: string;
    number: string;
    is_emergency_contact: boolean;
}
