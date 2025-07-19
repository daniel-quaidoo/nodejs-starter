import Container from 'typedi';
import { DataSource } from 'typeorm';

// dao
import { BaseDAO } from '../../../../core/common/dao/base.dao';

// entity
import { Amenity } from '../entities/amenity.entity';
import { IAmenityRepository } from '../interface/amenity.interface';

// decorator
import { Repository } from '../../../../core/common/di/component.decorator';

@Repository()
export class AmenityRepository extends BaseDAO<Amenity> implements IAmenityRepository {
    constructor() {
        const dataSource = Container.get(DataSource);
        super(dataSource, Amenity);
    }

    public async findWithRelations(
        limit: number = 10,
        offset: number = 0
    ): Promise<[Amenity[], number]> {
        const query = this.repository.createQueryBuilder('amenity').skip(offset).take(limit);

        const [amenities, total] = await query.getManyAndCount();
        return [amenities, total];
    }

    // public findOneWithRelations(id: string): Promise<Amenity | null> {
    //     return this.repository.createQueryBuilder('amenity').where('amenity.amenityId = :id', { id }).getOne();
    // }
}
