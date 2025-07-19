// decorator
import { Service } from '../../../core/common/di/component.decorator';

// repository
import { AmenityRepository } from './repository/amenity.repository';

// entities
import { Amenity } from './entities/amenity.entity';
import { EntityAmenities } from './entities/entity-amenities.entity';

// dto
import { AmenityDto, CreateAmenityDto } from './dto/amenity.dto';
import {
    CreateEntityAmenitiesDto,
    EntityAmenitiesDto,
} from '../amenities/dto/entity-amenities.dto';
import { BaseService } from '@/core/common';

@Service()
export class AmenityService extends BaseService<Amenity> {
    constructor(private readonly amenityRepository: AmenityRepository) {
        super(amenityRepository);
    }

    // Amenity Methods
    async createAmenity(dto: CreateAmenityDto): Promise<AmenityDto> {
        const amenity = new Amenity();
        amenity.amenityName = dto.amenityName;
        amenity.amenityShortName = dto.amenityShortName;
        amenity.description = dto.description || null;
        const savedAmenity = await this.amenityRepository.manager.save(amenity);
        return AmenityDto.toContract(savedAmenity);
    }

    async getAmenities(): Promise<AmenityDto[]> {
        const amenities = await this.amenityRepository.manager.find(Amenity, {
            select: ['amenityId', 'amenityName', 'amenityShortName', 'description'],
        });
        return amenities.map(a => AmenityDto.toContract(a));
    }

    async updateAmenity(amenityId: string, dto: CreateAmenityDto): Promise<AmenityDto> {
        const amenity = await this.amenityRepository.manager.findOne(Amenity, {
            where: { amenityId },
        });
        if (!amenity) {
            throw new Error('Amenity not found');
        }
        amenity.amenityName = dto.amenityName;
        amenity.amenityShortName = dto.amenityShortName;
        amenity.description = dto.description || null;
        const savedAmenity = await this.amenityRepository.manager.save(amenity);
        return AmenityDto.toContract(savedAmenity);
    }

    async deleteAmenity(id: string): Promise<void> {
        await this.amenityRepository.manager.delete(Amenity, { amenityId: id });
    }

    // EntityAmenities Methods
    async createEntityAmenities(dto: CreateEntityAmenitiesDto): Promise<EntityAmenitiesDto> {
        const entityAmenities = new EntityAmenities();
        entityAmenities.entityId = dto.entityId;
        entityAmenities.entityType = dto.entityType;
        entityAmenities.amenityId = dto.amenityId;
        const savedEntityAmenities = await this.amenityRepository.manager.save(entityAmenities);
        return EntityAmenitiesDto.toContract(savedEntityAmenities);
    }

    async getEntityAmenities(): Promise<EntityAmenitiesDto[]> {
        const entityAmenities = await this.amenityRepository.manager.find(EntityAmenities);
        return entityAmenities.map(ea => EntityAmenitiesDto.toContract(ea));
    }

    async deleteEntityAmenities(id: string): Promise<void> {
        await this.amenityRepository.manager.delete(EntityAmenities, { entityAmenitiesId: id });
    }
}
