// entity
import { Amenity } from '../entities/amenity.entity';

// interface
import { IBaseRepository } from '../../../../core/common/interfaces/base.repository.interface';

/**
 * Interface for user repository
 * @extends IBaseRepository<User>
 */
export interface IAmenityRepository extends IBaseRepository<Amenity> {
    findWithRelations(limit: number, offset: number): Promise<[Amenity[], number]>;
}
