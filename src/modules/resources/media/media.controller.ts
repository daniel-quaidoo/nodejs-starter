// dto
import { MediaDto } from './dto/media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

// service
import { MediaService } from './media.service';

// decorator
import { Body, Param } from '../../../core/common/decorators/param.decorator';
import {
    Post,
    Get,
    Put,
    Delete,
    Controller,
} from '../../../core/common/decorators/route.decorator';

@Controller('/media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) {}

    @Post('/media')
    public createMedia(@Body() dto: CreateMediaDto): Promise<MediaDto> {
        return this.mediaService.createMedia(dto);
    }

    @Get('/media')
    public getMedia(): Promise<MediaDto[]> {
        return this.mediaService.getMedia();
    }

    @Get('/media/property/:id')
    public getMediaByProperty(@Param('id') id: string): Promise<MediaDto[]> {
        return this.mediaService.getMediaByProperty(id);
    }

    @Put('/media/:id')
    public updateMedia(@Param('id') id: string, @Body() dto: UpdateMediaDto): Promise<MediaDto> {
        return this.mediaService.updateMedia(id, dto.toContract());
    }

    @Delete('/media/:id')
    public async deleteMedia(@Param('id') id: string): Promise<void> {
        await this.mediaService.deleteMedia(id);
    }
}
