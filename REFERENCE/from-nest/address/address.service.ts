import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

// dto
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";

// entities
import { Address } from "./entities/address.entity";
import { City } from "./city/entities/city.entity";
import { CityService } from "./city/city.service";

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
    @InjectRepository(City)
    private readonly cityRepo: Repository<City>,
    private readonly cityService: CityService
  ) {}

  async create(dto: CreateAddressDto): Promise<Address> {
    const { city_name, region_name, country_name, ...addressData } = dto;

    let city = await this.cityService.create({
        city_name: city_name.trim().toLowerCase(),
        region_name: region_name.trim().toLowerCase(),
        country_name: country_name.trim().toLowerCase(),
    });

    // Create the address linked to the city
    const newAddress = this.addressRepo.create({
      ...addressData,
      city,
    });

    // Save the address
    return await this.addressRepo.save(newAddress);
  }

  async findAll(): Promise<Address[]> {
    return this.addressRepo.find({ relations: ["city"] });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepo.findOne({
      where: { address_id: id },
      relations: ["city"],
    });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    return address;
  }

  async update(id: string, dto: UpdateAddressDto): Promise<Address> {
    const address = await this.addressRepo.findOne({ where: { address_id: id } });

    if (!address) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }

    // Object.assign(address, dto);

    // Check if the city already exists
    const existingCity = await this.cityRepo.findOne({
      where: { city_name: dto.city_name?.trim().toLowerCase() },
    });

    if (existingCity) {
      const city = await this.cityService.update(existingCity.city_id,{
        city_name: dto.city_name.trim().toLowerCase(),
        region_name: dto.region_name.trim().toLowerCase(),
        country_name: dto.country_name.trim().toLowerCase(),
      });
      address.city = city;
    }
    return this.addressRepo.save(address);
  }

  async remove(id: string): Promise<void> {
    const result = await this.addressRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Address with ID ${id} not found`);
    }
  }
}
