import { AddressType } from '../enums/address-type.enum';

export class CreateAddressDto {
    address_type: AddressType;
    primary: boolean;
    address_1: string;
    address_2?: string;
    address_postal_code: string;
    city_name: string;
    region_name: string;
    country_name: string;
}
