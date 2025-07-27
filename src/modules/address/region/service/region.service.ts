import { Inject } from 'typedi';
import { Region } from '../entities/region.entity';
import { RegionRepository } from '../repository/region.repository';
import { CountryService } from '../../country/service/country.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';

export class RegionService {
    constructor(
        @Inject() private regionRepository: RegionRepository,
        @Inject() private countryService: CountryService
    ) {}

    async createRegion(regionData: CreateRegionDto): Promise<Region> {
        // Find or create country
        let country = await this.countryService.findCountryByName(regionData.country_name);
        if (!country) {
            country = await this.countryService.createCountry({
                country_name: regionData.country_name,
            });
        }

        // Create region
        return this.regionRepository.create({
            region_name: regionData.region_name,
            country,
        });
    }

    async findAllRegions(): Promise<Region[]> {
        const result = await this.regionRepository.find({
            relations: ['country'],
        });
        return result;
    }

    async findRegionById(regionId: string): Promise<Region | null> {
        const result = await this.regionRepository.findRegionById(regionId);
        return result;
    }

    async findRegionByNameAndCountry(
        regionName: string,
        countryName: string
    ): Promise<Region | null> {
        const country = await this.countryService.findCountryByName(countryName);
        if (!country) {
            return null;
        }
        return this.regionRepository.findRegionByNameAndCountry(regionName, country.country_id);
    }

    async findRegionsByCountry(countryId: string): Promise<Region[]> {
        const result = await this.regionRepository.findRegionsByCountry(countryId);
        return result;
    }

    async updateRegion(regionId: string, updateData: UpdateRegionDto): Promise<Region | null> {
        await this.regionRepository.update({ region_id: regionId }, updateData);
        return this.findRegionById(regionId);
    }

    async deleteRegion(regionId: string): Promise<boolean> {
        const result = await this.regionRepository.delete({ region_id: regionId });
        return result.affected ? result.affected > 0 : false;
    }
}
