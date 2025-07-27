import Container from 'typedi';
import { DataSource } from 'typeorm';
import { City } from '../entities/city.entity';
import { BaseDAO } from '../../../../core/common/dao/base.dao';
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class CityRepository extends BaseDAO<City> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, City);
    }

    async findCityByNameAndRegion(cityName: string, regionId: string): Promise<City | null> {
        const result = await this.findOne({
            where: {
                city_name: cityName,
                region: { region_id: regionId },
            },
            relations: ['region', 'region.country'],
        });
        return result;
    }

    async findCityById(cityId: string): Promise<City | null> {
        const result = await this.findOne({
            where: { city_id: cityId },
            relations: ['region', 'region.country'],
        });
        return result;
    }

    async findCitiesByRegion(regionId: string): Promise<City[]> {
        const result = await this.find({
            where: { region: { region_id: regionId } },
            relations: ['region', 'region.country'],
        });
        return result;
    }
}
