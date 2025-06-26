import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';


//enums
import { MediaTypeEnum } from '@lib/contracts/resources/enums/media-type.enum';
import { DocumentEntityTypeEnum } from '@lib/contracts/resources/enums/document-type.enum';
import { User } from '../../auth/users/entities/user.entity';
import { UserDto } from '../../auth/users/dto/user.dto';

export class MediaDto {
  @ApiProperty({ description: 'Unique identifier for the media' })
  id: string;

  @ApiProperty({ description: 'Media name' })
  name: string;

  @ApiPropertyOptional({ description: 'Media description' })
  description?: string;

  @ApiProperty({ description: 'URL to access the media content' })
  content_url: string;

  @ApiProperty({ enum: MediaTypeEnum, description: 'Type of media (e.g., IMAGE, VIDEO, PDF)' })
  media_type: MediaTypeEnum;

  @ApiProperty({ description: 'Media alias used for internal linking or categorization' })
  media_alias: string;

  @ApiProperty({ description: 'ID of the entity this media is linked to' })
  entity_id: string;

  @ApiProperty({ enum: DocumentEntityTypeEnum, description: 'Type of entity the media is attached to' })
  entity_type: DocumentEntityTypeEnum;

  @ApiProperty({ description: 'ID of the user who uploaded the media' , type: [UserDto]})
  uploaded_by: User;

  @ApiProperty({ description: 'Date and time the media was uploaded' })
  uploaded_at: Date;

}
