import { Repository, DataSource } from 'typeorm';

// entity
import { Amenity } from '../entities/amenity.entity';

export class AmenityRepository extends Repository<Amenity> {
    constructor(connection: DataSource) {
        super(Amenity, connection.createEntityManager());
    }

    public async findWithRelations(
        limit: number = 10,
        offset: number = 0
    ): Promise<[Amenity[], number]> {
        const query = this.createQueryBuilder('amenity').skip(offset).take(limit);

        const [amenities, total] = await query.getManyAndCount();
        return [amenities, total];
    }

    public findOneWithRelations(id: string): Promise<Amenity | null> {
        return this.createQueryBuilder('amenity').where('amenity.amenityId = :id', { id }).getOne();
    }
}
