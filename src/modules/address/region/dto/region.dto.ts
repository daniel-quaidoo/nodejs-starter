import { CountryDto } from '../../country/dto/country.dto';

export class RegionDto {
    region_id: string;
    region_name: string;
    country: CountryDto;
    createdAt?: Date;
    updatedAt?: Date;
}
