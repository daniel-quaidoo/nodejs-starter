import { Repository } from 'typeorm';
import { Property } from '../entities/property.entity';
import { DataSource } from 'typeorm';

export class PropertyRepository extends Repository<Property> {
    constructor(connection: DataSource) {
        super(Property, connection.createEntityManager());
    }

    async findWithRelations(limit: number = 10, offset: number = 0): Promise<[Property[], number]> {
        const query = this.createQueryBuilder('property')
            .leftJoinAndSelect('property.propertyTypeEntity', 'propertyType')
            .leftJoinAndSelect('property.units', 'units')
            .leftJoinAndSelect('units.unitType', 'unitType')
            .skip(offset)
            .take(limit);

        const [properties, total] = await query.getManyAndCount();
        return [properties, total];
    }

    public findOneWithRelations(id: string): Promise<Property | null> {
        return this.createQueryBuilder('property')
            .where('property.propertyId = :id', { id })
            .leftJoinAndSelect('property.propertyTypeEntity', 'propertyType')
            .leftJoinAndSelect('property.units', 'units')
            .leftJoinAndSelect('units.unitType', 'unitType')
            .getOne();
    }
}
