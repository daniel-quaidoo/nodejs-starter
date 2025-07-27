import { AddressType } from '../enums/address-type.enum';
import { CityDto } from '../city/dto/city.dto';
import { RegionDto } from '../region/dto/region.dto';
import { CountryDto } from '../country/dto/country.dto';

export class AddressDto {
    address_id: string;
    address_type: AddressType;
    primary: boolean;
    address_1: string;
    address_2?: string;
    address_postal_code: string;
    city: CityDto;
    region: RegionDto;
    country: CountryDto;
    createdAt?: Date;
    updatedAt?: Date;
}
