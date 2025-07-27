import Container from 'typedi';
import { DataSource } from 'typeorm';
import { Country } from '../entities/country.entity';
import { BaseDAO } from '../../../../core/common/dao/base.dao';
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class CountryRepository extends BaseDAO<Country> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Country);
    }

    async findCountryByName(countryName: string): Promise<Country | null> {
        const result = await this.findOne({
            where: { country_name: countryName },
        });
        return result;
    }

    async findCountryById(countryId: string): Promise<Country | null> {
        const result = await this.findOne({
            where: { country_id: countryId },
        });
        return result;
    }
}
