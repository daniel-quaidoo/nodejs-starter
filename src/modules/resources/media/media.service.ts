// entity
import { Media } from './entities/media.entity';

// repository
import { MediaRepository } from './repository/media.repository';

// decorator
import { Service } from '../../../core/common/di/component.decorator';

// enum
import { MediaTypeEnum } from '../../../shared/media/enums/media.enum';

// dto
import { MediaDto } from './dto/media.dto';
import { CreateMediaContractDto } from '../../../shared/media/create-media.dto';
import { UpdateMediaContractDto } from '../../../shared/media/update-media.dto';

@Service()
export class MediaService {
    constructor(private readonly mediaRepository: MediaRepository) {}

    async createMedia(dto: CreateMediaContractDto): Promise<MediaDto> {
        const media = new Media();
        media.mediaName = dto.mediaName;
        media.mediaType = dto.mediaType as MediaTypeEnum;
        media.contentUrl = dto.contentUrl;
        media.isThumbnail = dto.isThumbnail;
        media.caption = dto.caption || null;
        media.description = dto.description || null;
        const savedMedia = await this.mediaRepository.manager.save(media);

        return MediaDto.toContract(savedMedia);
    }

    public getMedia(): Promise<MediaDto[]> {
        return this.mediaRepository.manager
            .find(Media)
            .then((media: any[]) => media.map(m => MediaDto.toContract(m)));
    }

    public getMediaByProperty(mediaId: string): Promise<MediaDto[]> {
        return this.mediaRepository.manager
            .find(Media, {
                where: { entityId: mediaId },
                relations: ['uploadedBy'],
            })
            .then((media: any[]) => media.map(m => MediaDto.toContract(m)));
    }

    async updateMedia(id: string, dto: UpdateMediaContractDto): Promise<MediaDto> {
        const media = await this.mediaRepository.manager.findOne(Media, {
            where: { mediaId: id },
        });

        if (!media) {
            throw new Error('Media not found');
        }

        media.mediaName = dto.mediaName;
        media.mediaType = dto.mediaType as MediaTypeEnum;
        media.contentUrl = dto.contentUrl;
        media.isThumbnail = dto.isThumbnail;
        media.caption = dto.caption || null;
        media.description = dto.description || null;
        const updatedMedia = await this.mediaRepository.manager.save(media);

        return MediaDto.toContract(updatedMedia);
    }

    async deleteMedia(id: string): Promise<void> {
        await this.mediaRepository.manager.delete(Media, { mediaId: id });
    }

    async deleteProperty(id: string): Promise<void> {
        const property = await this.mediaRepository.findOneWithRelations(id);
        if (!property) {
            throw new Error('Property not found');
        }
        await this.mediaRepository.remove(property);
    }
}
