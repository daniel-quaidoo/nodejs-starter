import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from "@nestjs/common";

// entity
import { City } from "./entities/city.entity";
import { Region } from "../region/entities/region.entity";
import { Country } from "../country/entities/country.entity";

// constant
import { ERROR_MESSAGES } from "../address.constants";

// helpers
import { isUniqueConstraintViolation } from "../../../../../common/utils/helpers";

// dto
import { CreateCityDto } from "@lib/contracts/address/city/create-city.dto";
import { UpdateCityDto } from "@lib/contracts/address/city/update-city.dto";

@Injectable()
export class CityService {
    constructor(
        @InjectRepository(City)
        private readonly cityRepo: Repository<City>,
        @InjectRepository(Region)
        private readonly regionRepo: Repository<Region>,
        @InjectRepository(Country)
        private readonly countryRepo: Repository<Country>
    ) { }

    async create(dto: CreateCityDto): Promise<City> {
        try {
            const { city_name, region_name, country_name } = {
                city_name: dto.city_name?.toLowerCase(),
                region_name: dto.region_name?.toLowerCase(),
                country_name: dto.country_name?.toLowerCase(),
            };

            // Check if the country exists
            let country = await this.countryRepo.findOne({ where: { country_name } });

            if (!country) {
                country = this.countryRepo.create({ country_name });
                country = await this.countryRepo.save(country);
                //   throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND(country_name));
            }

            // Check if the region exists and is linked to the country
            let region = await this.regionRepo.findOne({
                where: { region_name, country },
            });

            if (!region) {
                region = this.regionRepo.create({ region_name, country });

                // Save the new region
                await this.regionRepo.save(region);
            }

            // Check if the city already exists in the region
            const existingCity = await this.cityRepo.findOne({
                where: { city_name, region },
            });

            if (existingCity) {
                throw new HttpException(
                    ERROR_MESSAGES.CITY_ALREADY_EXISTS(city_name, region_name),
                    HttpStatus.BAD_REQUEST
                );
            }

            try {
                // Create and save the new city
                const newCity = this.cityRepo.create({ city_name, region });
                return await this.cityRepo.save(newCity);
            } catch (error) {
                if (isUniqueConstraintViolation(error)) {
                    throw new HttpException(
                        ERROR_MESSAGES.CITY_ALREADY_EXISTS(city_name, region_name),
                        HttpStatus.INTERNAL_SERVER_ERROR
                    );
                }
            }
        } catch (error) {
            throw new HttpException(
                error.message || error.detail || "An unexpected error occurred",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async findAll(): Promise<City[]> {
        return this.cityRepo.find({ relations: ["region"] });
    }

    async findOne(id: string): Promise<City> {
        const city = await this.cityRepo.findOne({
            where: { city_id: id },
            relations: ["region"],
        });

        if (!city)
            throw new NotFoundException(ERROR_MESSAGES.CITY_NOT_FOUND_BY_ID(id));
        return city;
    }

    async findByCity(cityName: string, regionName: string, countryName: string): Promise<City> {
        const { city_name, region_name, country_name } = {
            city_name: cityName?.toLowerCase(),
            region_name: regionName?.toLowerCase(),
            country_name: countryName?.toLowerCase(),
        };

        // Check if the country exists
        const country = await this.countryRepo.findOne({
            where: { country_name: country_name },
        });

        if (!country) {
            throw new NotFoundException(ERROR_MESSAGES.COUNTRY_NOT_FOUND(country_name));
        }

        // Check if the region exists and is linked to the country
        const region = await this.regionRepo.findOne({
            where: { region_name: region_name, country },
        });

        if (!region) {
            throw new NotFoundException(ERROR_MESSAGES.REGION_NOT_FOUND(region_name, country_name));
        }

        // Check if the city exists and is linked to the region
        const city = await this.cityRepo.findOne({
            where: { city_name: city_name, region },
            relations: ["region", "region.country"],
        });

        if (!city) {
            throw new NotFoundException(ERROR_MESSAGES.CITY_NOT_FOUND(city_name));
        }

        return city;
    }

    async update(id: string, dto: UpdateCityDto): Promise<City> {
        const { city_name, region_name, country_name } = {
            city_name: dto.city_name?.toLowerCase(),
            region_name: dto.region_name?.toLowerCase(),
            country_name: dto.country_name?.toLowerCase(),
        };

        // Find the existing city by ID
        const city = await this.cityRepo.findOne({ where: { city_id: id } });

        if (!city) {
            throw new NotFoundException(ERROR_MESSAGES.CITY_NOT_FOUND_BY_ID(id));
        }

        // Validate region and country (if provided)
        let region = city.region;
        if (region_name || country_name) {
            if (!region_name || !country_name) {
                throw new Error(ERROR_MESSAGES.BOTH_REGION_AND_COUNTRY_REQUIRED);
            }

            // Check if the country exists
            const country = await this.countryRepo.findOne({
                where: { country_name },
            });

            if (!country) {
                throw new Error(ERROR_MESSAGES.COUNTRY_NOT_FOUND(country_name));
            }

            // Check if the region exists and is linked to the country
            region = await this.regionRepo.findOne({
                where: { region_name, country },
            });

            if (!region) {
                throw new Error(
                    ERROR_MESSAGES.REGION_NOT_FOUND(region_name, country_name)
                );
            }
        }

        // Update the city fields
        if (city_name) {
            city.city_name = city_name;
        }

        if (region) {
            city.region = region;
        }

        try {
            // Save the updated city
            return await this.cityRepo.save(city);
        } catch (error) {
            if (isUniqueConstraintViolation(error)) {
                throw new Error(
                    ERROR_MESSAGES.CITY_ALREADY_EXISTS(city_name, region_name)
                );
            }
            throw error;
        }
    }

    async remove(id: string): Promise<void> {
        const city = await this.findOne(id);
        await this.cityRepo.remove(city);
    }
}
