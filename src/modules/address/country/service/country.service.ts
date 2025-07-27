import { Inject } from 'typedi';
import { Country } from '../entities/country.entity';
import { CountryRepository } from '../repository/country.repository';
import { CreateCountryDto } from '../dto/create-country.dto';
import { UpdateCountryDto } from '../dto/update-country.dto';

export class CountryService {
    constructor(@Inject() private countryRepository: CountryRepository) {}

    async createCountry(countryData: CreateCountryDto): Promise<Country> {
        const result = await this.countryRepository.create(countryData);
        return result;
    }

    async findAllCountries(): Promise<Country[]> {
        const result = await this.countryRepository.find();
        return result;
    }

    async findCountryById(countryId: string): Promise<Country | null> {
        const result = await this.countryRepository.findCountryById(countryId);
        return result;
    }

    async findCountryByName(countryName: string): Promise<Country | null> {
        const result = await this.countryRepository.findCountryByName(countryName);
        return result;
    }

    async updateCountry(countryId: string, updateData: UpdateCountryDto): Promise<Country | null> {
        await this.countryRepository.update({ country_id: countryId }, updateData);
        return this.findCountryById(countryId);
    }

    async deleteCountry(countryId: string): Promise<boolean> {
        const result = await this.countryRepository.delete({ country_id: countryId });
        return result.affected ? result.affected > 0 : false;
    }
}
