import Container from 'typedi';
import { DataSource } from 'typeorm';
import { Address } from '../entities/address.entity';
import { AddressType } from '../enums/address-type.enum';
import { BaseDAO } from '../../../core/common/dao/base.dao';
import { Repository } from '../../../core/common/di/component.decorator';

@Repository()
export class AddressRepository extends BaseDAO<Address> {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Address);
    }

    async findAddressById(addressId: string): Promise<Address | null> {
        const result = await this.findOne({
            where: { address_id: addressId },
            relations: ['city', 'region', 'country'],
        });
        return result;
    }

    async findAddressesByType(addressType: AddressType): Promise<Address[]> {
        const result = await this.find({
            where: { address_type: addressType },
            relations: ['city', 'region', 'country'],
        });
        return result;
    }

    async findPrimaryAddresses(): Promise<Address[]> {
        const result = await this.find({
            where: { primary: true },
            relations: ['city', 'region', 'country'],
        });
        return result;
    }
}
