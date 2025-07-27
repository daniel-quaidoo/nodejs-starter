import Container from 'typedi';
import { DataSource } from 'typeorm';
import { Region } from '../entities/region.entity';
import { BaseDAO } from '../../../../core/common/dao/base.dao';
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class RegionRepository extends BaseDAO<Region> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Region);
    }

    async findRegionByNameAndCountry(
        regionName: string,
        countryId: string
    ): Promise<Region | null> {
        const result = await this.findOne({
            where: {
                region_name: regionName,
                country: { country_id: countryId },
            },
            relations: ['country'],
        });
        return result;
    }

    async findRegionById(regionId: string): Promise<Region | null> {
        const result = await this.findOne({
            where: { region_id: regionId },
            relations: ['country'],
        });
        return result;
    }

    async findRegionsByCountry(countryId: string): Promise<Region[]> {
        const result = await this.find({
            where: { country: { country_id: countryId } },
            relations: ['country'],
        });
        return result;
    }
}
