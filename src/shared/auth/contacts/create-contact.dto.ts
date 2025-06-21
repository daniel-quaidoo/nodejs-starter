// dto
import { UserDto } from "../users/user.dto";

export class CreateContactDto {
    user: UserDto;
    first_name: String;
    last_name: String;
    email: String;
    relation: String;
    number: String;
    is_emergency_contact: boolean;
}