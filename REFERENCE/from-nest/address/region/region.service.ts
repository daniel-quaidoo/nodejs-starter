import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

//entity
import { Region } from "./entities/region.entity";
import { Country } from "../country/entities/country.entity";

//dto
import { CreateRegionDto } from "./dto/create-region.dto";
import { UpdateRegionDto } from "./dto/update-region.dto";

//constants
import { ERROR_MESSAGES } from "../address.constants";
import { isUniqueConstraintViolation } from "@app/common/utils/helpers";

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(Region)
    private readonly regionRepo: Repository<Region>,
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>
  ) {}

  async createRegion(dto: CreateRegionDto): Promise<Region> {
    const { region_name, country_name } = {
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

    // Check if the region already exists in the country
    const existingRegion = await this.regionRepo.findOne({
      where: { region_name, country },
    });

    if (existingRegion) {
      throw new HttpException(
        ERROR_MESSAGES.REGION_ALREADY_EXISTS(region_name, country_name),
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      // Create and save the new region
      const newRegion = this.regionRepo.create({ region_name, country });
      return await this.regionRepo.save(newRegion);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new HttpException(
          ERROR_MESSAGES.REGION_ALREADY_EXISTS(region_name, country_name),
          HttpStatus.BAD_REQUEST
        );
      }
        // Handle other errors
      throw new HttpException(
        error.message || 'An unexpected error occurred',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async findAll(): Promise<Region[]> {
    return this.regionRepo.find();
  }

  async findOne(id: string): Promise<Region> {
    const region = await this.regionRepo.findOne({
      where: { region_id: id },
      relations: ["country"],
    });

    if (!region)
      throw new NotFoundException(ERROR_MESSAGES.REGION_NOT_FOUND_BY_ID(id));

    return region;
  }

  async update(id: string, dto: UpdateRegionDto): Promise<Region> {
    const { region_name, country_name } = {
      region_name: dto.region_name?.toLowerCase(),
      country_name: dto.country_name?.toLowerCase(),
    };

    // Find the existing region by ID
    const region = await this.regionRepo.findOne({ where: { region_id: id } });

    if (!region) {
      throw new NotFoundException(ERROR_MESSAGES.REGION_NOT_FOUND_BY_ID(id));
    }

    // Validate or create the country
    let country = region.country;

    if (country_name) {
      // Check if the country exists, if not, create it
      country = await this.countryRepo.findOne({ where: { country_name } });

      if (!country) {
        country = this.countryRepo.create({ country_name });
        country = await this.countryRepo.save(country);
      } else if (!country) {
        // If no country_name is provided and region.country is null, throw an error
        throw new HttpException(ERROR_MESSAGES.COUNTRY_REQUIRED_FOR_REGION, HttpStatus.BAD_REQUEST);
      }
    }

    // Update the region fields
    if (region_name) {
      region.region_name = region_name;
    }

    if (country) {
      region.country = country;
    }

    try {
      // Save the updated region
      return await this.regionRepo.save(region);
    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new HttpException(ERROR_MESSAGES.REGION_ALREADY_EXISTS(region_name, country_name), HttpStatus.BAD_REQUEST);
      }
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    const region = await this.regionRepo.delete(id);
    if (region.affected === 0)
      throw new NotFoundException(ERROR_MESSAGES.REGION_NOT_FOUND_BY_ID(id));
  }
}
