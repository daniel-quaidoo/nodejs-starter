import { RegionDto } from '../../region/dto/region.dto';

export class CityDto {
    city_id: string;
    city_name: string;
    region: RegionDto;
    createdAt?: Date;
    updatedAt?: Date;
}
