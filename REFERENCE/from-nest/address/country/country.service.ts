import { DeepPartial, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

// constants
import { ERROR_MESSAGES } from "../address.constants";

// entity
import { Country } from "./entities/country.entity";

// helpers
import { isUniqueConstraintViolation } from "@app/common/utils/helpers";

// dto
import { CreateCountryDto } from "@lib/contracts/address/country/create-country.dto";
import { UpdateCountryDto } from "@lib/contracts/address/country/update-country.dto";

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepo: Repository<Country>
  ) {}

  async create(dto: CreateCountryDto): Promise<Country> {
    const country = await this.countryRepo.findOne({
      where: { country_name: dto.country_name.trim().toLowerCase() },
    });

    try {
      // Create and save the new country
      const newCountry = this.countryRepo.create(dto);
      return await this.countryRepo.save(newCountry);

    } catch (error) {
      if (isUniqueConstraintViolation(error)) {
        throw new HttpException(
          ERROR_MESSAGES.COUNTRY_ALREADY_EXISTS(country.country_name),
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

  async findAll(): Promise<Country[]> {
    return this.countryRepo.find();
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countryRepo.findOne({
      where: { country_id: id },
    });

    if (!country)
      throw new NotFoundException(ERROR_MESSAGES.COUNTRY_NOT_FOUND_BY_ID(id));

    return country;
  }

  async update(id: string, dto: UpdateCountryDto): Promise<Country> {
    const country = await this.countryRepo.findOne({
      where: { country_id: id },
    });

    if (!country)
      throw new NotFoundException(ERROR_MESSAGES.COUNTRY_NOT_FOUND_BY_ID(id));

    Object.assign(country, {
      ...dto,
      country_name: dto.country_name?.trim().toLowerCase(),
    });

    return this.countryRepo.save(country);
  }

  async delete(id: string): Promise<void> {
    const country = await this.countryRepo.delete(id);
    if (country.affected === 0)
      throw new NotFoundException(ERROR_MESSAGES.COUNTRY_NOT_FOUND_BY_ID(id));
  }
}
