import { IsString, IsBoolean, IsDate } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { MediaContractDto } from '../../../../shared/media/media.dto';

export class MediaDto extends BaseMapper<MediaContractDto> {
    protected ContractClass = MediaContractDto;

    @IsString()
    mediaId: string;

    @IsString()
    mediaName: string;

    @IsString()
    mediaType: string;

    @IsString()
    contentUrl: string;

    @IsBoolean()
    isThumbnail: boolean;

    @IsString()
    caption: string | null;

    @IsString()
    description: string | null;

    @IsString()
    entityId: string;

    @IsString()
    entityType: string;

    @IsString()
    uploadedBy: string;

    @IsDate()
    uploadedAt: Date;

    @IsString()
    mediaAlias: string;
}
