// decorator
import { Service } from '../../core/common/di/component.decorator';

// repository
import { PropertyRepository } from './repository/property.repository';

// DTOs
import { PropertyTypeDto, CreatePropertyTypeDto } from './dto/property-type.dto';
import { UnitTypeDto, CreateUnitTypeDto } from './dto/unit-type.dto';
import { AmenityDto, CreateAmenityDto } from './dto/amenity.dto';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyDto } from './dto/property.dto';
import { CreateEntityAmenitiesDto, EntityAmenitiesDto } from './dto/entity-amenities.dto';
import { CreateMediaDto, MediaDto } from './dto/media.dto';

// entities
import { Property } from './entities/property.entity';
import { PropertyType } from './entities/property-type.entity';
import { UnitType } from './entities/unit-type.entity';
import { Amenity } from './entities/amenity.entity';
import { EntityAmenities } from './entities/entity-amenities.entity';
import { Media } from './entities/media.entity';
import { PropertyUnitAssoc } from './entities/property-unit-assoc.entity';

// enum
import { PropertyType as PropertyTypeEnum } from '../../shared/properties/properties.enum';
import { PropertyStatus } from '../../shared/properties/properties.enum';

@Service()
export class PropertyService {
    constructor(private readonly propertyRepository: PropertyRepository) {}

    async getProperties(limit: number = 10, offset: number = 0): Promise<[PropertyDto[], number]> {
        const [properties, total] = await this.propertyRepository.findWithRelations(limit, offset);
        const propertyDtos = properties.map(property => PropertyDto.toContract(property));
        return [propertyDtos, total];
    }

    async getProperty(id: string): Promise<PropertyDto | null> {
        const property = await this.propertyRepository.findOneWithRelations(id);
        if (!property) return null;
        return PropertyDto.toContract(property);
    }

    // Property Type Methods
    async createPropertyType(dto: CreatePropertyTypeDto): Promise<PropertyTypeDto> {
        const propertyType = new PropertyType();
        propertyType.name = dto.name;
        propertyType.description = dto.description;
        const savedPropertyType = await this.propertyRepository.manager.save(propertyType);
        return PropertyTypeDto.toContract(savedPropertyType);
    }

    async getPropertyTypes(): Promise<PropertyTypeDto[]> {
        const propertyTypes = await this.propertyRepository.manager.find(PropertyType, {
            relations: ['properties'],
        });
        return propertyTypes.map(pt => PropertyTypeDto.toContract(pt));
    }

    // Unit Type Methods
    async createUnitType(dto: CreateUnitTypeDto): Promise<UnitTypeDto> {
        const unitType = new UnitType();
        unitType.unitTypeName = dto.unitTypeName;
        const savedUnitType = await this.propertyRepository.manager.save(unitType);
        return UnitTypeDto.toContract(savedUnitType);
    }

    async getUnitTypes(): Promise<UnitTypeDto[]> {
        const unitTypes = await this.propertyRepository.manager.find(UnitType);
        return unitTypes.map(ut => UnitTypeDto.toContract(ut));
    }

    // Property Methods
    async createProperty(dto: CreatePropertyDto): Promise<PropertyDto> {
        const property = new Property();
        property.name = dto.name;
        property.propertyType = dto.propertyType as PropertyTypeEnum;
        property.numUnits = dto.numUnits;
        property.numBathrooms = dto.numBathrooms;
        property.numGarages = dto.numGarages;
        property.hasBalconies = dto.hasBalconies;
        property.hasParkingSpace = dto.hasParkingSpace;
        property.petsAllowed = dto.petsAllowed;
        if (dto.description) {
            property.description = dto.description;
        }
        const propertyType = await this.propertyRepository.manager.findOne(PropertyType, {
            where: { name: dto.propertyType },
        });
        if (!propertyType) {
            throw new Error('Property type not found');
        }
        property.propertyTypeEntity = propertyType;
        const savedProperty = await this.propertyRepository.save(property);
        return PropertyDto.toContract(savedProperty);
    }

    async getPropertiesWithPagination(
        limit: number,
        offset: number
    ): Promise<[PropertyDto[], number]> {
        const query = this.propertyRepository.manager
            .createQueryBuilder(Property, 'property')
            .leftJoinAndSelect('property.addresses', 'address')
            .leftJoinAndSelect('property.units', 'unit')
            .leftJoinAndSelect('unit.amenities', 'amenity')
            .leftJoinAndSelect('unit.media', 'media')
            .leftJoinAndSelect('property.amenities', 'propertyAmenity')
            .leftJoinAndSelect('property.media', 'propertyMedia')
            .orderBy('property.createdAt', 'DESC');

        const [properties, total] = await query.skip(offset).take(limit).getManyAndCount();

        return [properties.map(p => PropertyDto.toContract(p)), total];
    }

    async updateProperty(id: string, dto: CreatePropertyDto): Promise<PropertyDto> {
        const property = await this.propertyRepository.findOneWithRelations(id);
        if (!property) {
            throw new Error('Property not found');
        }

        property.name = dto.name;
        property.propertyType = dto.propertyType as PropertyTypeEnum;
        property.amount = dto.amount;
        property.securityDeposit = dto.securityDeposit;
        property.commission = dto.commission;
        property.floorSpace = dto.floorSpace;
        property.numUnits = dto.numUnits;
        property.numBathrooms = dto.numBathrooms;
        property.numGarages = dto.numGarages;
        property.hasBalconies = dto.hasBalconies;
        property.hasParkingSpace = dto.hasParkingSpace;
        property.petsAllowed = dto.petsAllowed;
        if (dto.description) {
            property.description = dto.description;
        }
        property.propertyStatus = PropertyStatus.AVAILABLE;

        const propertyType = await this.propertyRepository.manager.findOne(PropertyType, {
            where: { name: dto.propertyType },
        });
        if (!propertyType) {
            throw new Error('Property type not found');
        }
        property.propertyTypeEntity = propertyType;

        const savedProperty = await this.propertyRepository.save(property);
        return PropertyDto.toContract(savedProperty);
    }

    // Amenity Methods
    async createAmenity(dto: CreateAmenityDto): Promise<AmenityDto> {
        const amenity = new Amenity();
        amenity.amenityName = dto.amenityName;
        amenity.amenityShortName = dto.amenityShortName;
        amenity.description = dto.description || null;
        const savedAmenity = await this.propertyRepository.manager.save(amenity);
        return AmenityDto.toContract(savedAmenity);
    }

    async getAmenities(): Promise<AmenityDto[]> {
        const amenities = await this.propertyRepository.manager.find(Amenity, {
            select: ['amenityId', 'amenityName', 'amenityShortName', 'description'],
        });
        return amenities.map(a => AmenityDto.toContract(a));
    }

    async updateAmenity(amenityId: string, dto: CreateAmenityDto): Promise<AmenityDto> {
        const amenity = await this.propertyRepository.manager.findOne(Amenity, {
            where: { amenityId },
        });
        if (!amenity) {
            throw new Error('Amenity not found');
        }
        amenity.amenityName = dto.amenityName;
        amenity.amenityShortName = dto.amenityShortName;
        amenity.description = dto.description || null;
        const savedAmenity = await this.propertyRepository.manager.save(amenity);
        return AmenityDto.toContract(savedAmenity);
    }

    async deleteAmenity(id: string): Promise<void> {
        await this.propertyRepository.manager.delete(Amenity, { amenityId: id });
    }

    // EntityAmenities Methods
    async createEntityAmenities(dto: CreateEntityAmenitiesDto): Promise<EntityAmenitiesDto> {
        const entityAmenities = new EntityAmenities();
        entityAmenities.entityId = dto.entityId;
        entityAmenities.entityType = dto.entityType;
        entityAmenities.amenityId = dto.amenityId;
        const savedEntityAmenities = await this.propertyRepository.manager.save(entityAmenities);
        return EntityAmenitiesDto.toContract(savedEntityAmenities);
    }

    async getEntityAmenities(): Promise<EntityAmenitiesDto[]> {
        const entityAmenities = await this.propertyRepository.manager.find(EntityAmenities);
        return entityAmenities.map(ea => EntityAmenitiesDto.toContract(ea));
    }

    async deleteEntityAmenities(id: string): Promise<void> {
        await this.propertyRepository.manager.delete(EntityAmenities, { entityAmenitiesId: id });
    }

    // Media Methods
    async createMedia(dto: CreateMediaDto): Promise<MediaDto> {
        const media = new Media();
        media.mediaName = dto.mediaName;
        media.mediaType = dto.mediaType;
        media.contentUrl = dto.contentUrl;
        media.isThumbnail = dto.isThumbnail;
        media.caption = dto.caption || null;
        media.description = dto.description || null;
        const savedMedia = await this.propertyRepository.manager.save(media);
        return MediaDto.toContract(savedMedia);
    }

    async getMedia(): Promise<MediaDto[]> {
        return this.propertyRepository.manager
            .find(Media)
            .then(media => media.map(m => MediaDto.toContract(m)));
    }

    async getMediaByProperty(propertyId: string): Promise<MediaDto[]> {
        return this.propertyRepository.manager
            .find(Media, {
                where: { property: { propertyUnitAssocId: propertyId } },
                relations: ['property'],
            })
            .then(media => media.map(m => MediaDto.toContract(m)));
    }

    async updateMedia(id: string, dto: CreateMediaDto): Promise<MediaDto> {
        const media = await this.propertyRepository.manager.findOne(Media, {
            where: { mediaId: id },
        });
        if (!media) {
            throw new Error('Media not found');
        }
        media.mediaName = dto.mediaName;
        media.mediaType = dto.mediaType;
        media.contentUrl = dto.contentUrl;
        media.isThumbnail = dto.isThumbnail;
        media.caption = dto.caption || null;
        media.description = dto.description || null;
        const updatedMedia = await this.propertyRepository.manager.save(media);
        return MediaDto.toContract(updatedMedia);
    }

    async deleteMedia(id: string): Promise<void> {
        await this.propertyRepository.manager.delete(Media, { mediaId: id });
    }

    async deleteProperty(id: string): Promise<void> {
        const property = await this.propertyRepository.findOneWithRelations(id);
        if (!property) {
            throw new Error('Property not found');
        }
        await this.propertyRepository.remove(property);
    }
}
