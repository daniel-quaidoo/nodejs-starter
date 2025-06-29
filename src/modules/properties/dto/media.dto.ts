import { IsString, IsBoolean, IsOptional } from 'class-validator';

// mapper
import { BaseMapper } from '../../../core/common/mappers/base.mapper';

// entity
import { Media } from '../entities/media.entity';

export class CreateMediaDto {
    @IsString()
    mediaName: string;

    @IsString()
    mediaType: string;

    @IsString()
    contentUrl: string;

    @IsBoolean()
    isThumbnail: boolean;

    @IsString()
    @IsOptional()
    caption?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class MediaDto extends BaseMapper<CreateMediaDto> {
    protected ContractClass = CreateMediaDto;

    id: string;
    mediaName: string;
    mediaType: string;
    contentUrl: string;
    isThumbnail: boolean;
    caption: string | null;
    description: string | null;
    propertyId: string;

    public static toContract(media: Media): MediaDto {
        const dto = new MediaDto();
        dto.id = media.mediaId;
        dto.mediaName = media.mediaName;
        dto.mediaType = media.mediaType;
        dto.contentUrl = media.contentUrl;
        dto.isThumbnail = media.isThumbnail;
        dto.caption = media.caption;
        dto.description = media.description;
        dto.propertyId = media.property.propertyUnitAssocId;
        return dto;
    }
}
