import { Inject } from 'typedi';
import { Address } from '../entities/address.entity';
import { AddressRepository } from '../repository/address.repository';
import { CityService } from '../city/service/city.service';
import { CreateAddressDto } from '../dto/create-address.dto';
import { UpdateAddressDto } from '../dto/update-address.dto';

export class AddressService {
    constructor(
        @Inject() private addressRepository: AddressRepository,
        @Inject() private cityService: CityService
    ) {}

    async createAddress(addressData: CreateAddressDto): Promise<Address> {
        // Create or find city (which will handle region and country)
        const city = await this.cityService.createCity({
            city_name: addressData.city_name,
            region_name: addressData.region_name,
            country_name: addressData.country_name,
        });

        // Create the address
        return this.addressRepository.create({
            ...addressData,
            city,
        });
    }

    async findAllAddresses(): Promise<Address[]> {
        const result = await this.addressRepository.find({
            relations: ['city', 'region', 'country'],
        });
        return result;
    }

    async findAddressById(addressId: string): Promise<Address | null> {
        const result = await this.addressRepository.findAddressById(addressId);
        return result;
    }

    async updateAddress(addressId: string, updateData: UpdateAddressDto): Promise<Address | null> {
        await this.addressRepository.update({ address_id: addressId }, updateData);
        return this.findAddressById(addressId);
    }

    async deleteAddress(addressId: string): Promise<boolean> {
        const result = await this.addressRepository.delete({ address_id: addressId });
        return result.affected ? result.affected > 0 : false;
    }
}
