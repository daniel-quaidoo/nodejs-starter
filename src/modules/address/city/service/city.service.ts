import { Inject } from 'typedi';
import { City } from '../entities/city.entity';
import { CityRepository } from '../repository/city.repository';
import { RegionService } from '../../region/service/region.service';
import { CreateCityDto } from '../dto/create-city.dto';
import { UpdateCityDto } from '../dto/update-city.dto';

export class CityService {
    constructor(
        @Inject() private cityRepository: CityRepository,
        @Inject() private regionService: RegionService
    ) {}

    async createCity(cityData: CreateCityDto): Promise<City> {
        // Find or create region (which will also handle country)
        let region = await this.regionService.findRegionByNameAndCountry(
            cityData.region_name,
            cityData.country_name
        );

        if (!region) {
            region = await this.regionService.createRegion({
                region_name: cityData.region_name,
                country_name: cityData.country_name,
            });
        }

        // Create city
        return this.cityRepository.create({
            city_name: cityData.city_name,
            region,
        });
    }

    async findAllCities(): Promise<City[]> {
        const result = await this.cityRepository.find({
            relations: ['region', 'region.country'],
        });
        return result;
    }

    async findCityById(cityId: string): Promise<City | null> {
        const result = await this.cityRepository.findCityById(cityId);
        return result;
    }

    async findCitiesByRegion(regionId: string): Promise<City[]> {
        const result = await this.cityRepository.findCitiesByRegion(regionId);
        return result;
    }

    async updateCity(cityId: string, updateData: UpdateCityDto): Promise<City | null> {
        await this.cityRepository.update({ city_id: cityId }, updateData);
        return this.findCityById(cityId);
    }

    async deleteCity(cityId: string): Promise<boolean> {
        const result = await this.cityRepository.delete({ city_id: cityId });
        return result.affected ? result.affected > 0 : false;
    }
}
