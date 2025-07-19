import { Controller, Post, Get, Patch, Delete , Body, Param} from '@nestjs/common';
import { ResourcesService } from './resources.service';

//dto
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

//entity
import { Media } from './entities/media.entity';


@Controller('resources')
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post('media')
  async createMedia(@Body() createMediaDto: CreateMediaDto): Promise<Media> {
    return this.resourcesService.createMedia(createMediaDto);
  }

  @Get('media')
  async findAllMedia(): Promise<Media[]> {
    return this.resourcesService.findAllMedia();
  }

  @Get('media/:mediaId')
  async findOneMedia(@Param('mediaId') mediaId: string): Promise<Media> {
    return this.resourcesService.findOneMedia(mediaId);
  }

  @Patch('media/:mediaId')
  async updateMedia(@Param('mediaId') mediaId: string, @Body() updateDto: UpdateMediaDto): Promise<Media> {
    return this.resourcesService.updateMedia(mediaId, updateDto);
  }

  @Delete('media/:mediaId')
  async removeMedia(@Param('mediaId') mediaId: string): Promise<void> {
    return this.resourcesService.removeMedia(mediaId);
  }
}
