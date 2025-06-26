// dto
import { UserContractDto } from '../users/user.dto';

export class ContactContractDto {
    id: string;
    user: UserContractDto;
    first_name: string;
    last_name: string;
    email: string;
    relation: string;
    number: string;
    is_emergency_contact: boolean;
}
