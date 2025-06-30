import { Repository, DataSource } from 'typeorm';

// entity
import { Media } from '../entities/media.entity';

export class MediaRepository extends Repository<Media> {
    constructor(connection: DataSource) {
        super(Media, connection.createEntityManager());
    }

    async findWithRelations(limit: number = 10, offset: number = 0): Promise<[Media[], number]> {
        const query = this.createQueryBuilder('media').skip(offset).take(limit);

        const [media, total] = await query.getManyAndCount();
        return [media, total];
    }

    public findOneWithRelations(id: string): Promise<Media | null> {
        return this.createQueryBuilder('media').where('media.mediaId = :id', { id }).getOne();
    }
}
