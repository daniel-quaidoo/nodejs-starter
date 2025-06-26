import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

//entity
import { Media } from './entities/media.entity';

//dtos
import { UpdateMediaDto } from '@lib/contracts/resources/update-media.dto';
import { CreateMediaDto } from '@lib/contracts/resources/create-media.dto';

@Injectable()
export class ResourcesService {
    constructor(
        @InjectRepository(Media)
        private readonly mediaRepository: Repository<Media>,
    ) {}

    async createMedia(dto: CreateMediaDto): Promise<Media> {
        const media = this.mediaRepository.create(dto);
        return this.mediaRepository.save(media);
    }

    async findAllMedia(): Promise<Media[]> {
        return this.mediaRepository.find({ relations: ['uploaded_by'] });
    }

    async findOneMedia(id: string): Promise<Media | null> {
        const media = await this.mediaRepository.findOne({ where: { id }, relations: ['uploaded_by'] });
        if(!media) throw new NotFoundException('Media not found');

        return media
    }

    async updateMedia(id: string, updateDto: UpdateMediaDto): Promise<Media> {
        const media = await this.mediaRepository.findOne({ where: { id }, relations: ['uploaded_by'] });
        if(!media) throw new NotFoundException('Media not found');
        const updated = this.mediaRepository.merge(media, updateDto);

        return this.mediaRepository.save(updated);
    }

    async removeMedia(id: string): Promise<void> {
        const media = await this.mediaRepository.findOne({ where: { id }, relations: ['uploaded_by'] });
        if(!media) throw new NotFoundException('Media not found');

        await this.mediaRepository.delete(media);
    }
}
