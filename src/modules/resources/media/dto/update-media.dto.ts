import { IsString, IsBoolean, IsDate } from 'class-validator';

// mapper
import { BaseMapper } from '../../../../core/common/mappers/base.mapper';

// dto
import { UpdateMediaContractDto } from '../../../../shared/media/update-media.dto';

export class UpdateMediaDto extends BaseMapper<UpdateMediaContractDto> {
    protected ContractClass = UpdateMediaContractDto;

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
