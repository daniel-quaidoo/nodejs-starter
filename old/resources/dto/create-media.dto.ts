import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';

//enums
import { MediaTypeEnum } from '@lib/contracts/resources/enums/media-type.enum';
import { DocumentEntityTypeEnum } from '@lib/contracts/resources/enums/document-type.enum';
import { UserDto } from '../../auth/users/dto/user.dto';
import { Type } from 'class-transformer';
import { User } from '../../auth/users/entities/user.entity';

export class CreateMediaDto {
  @ApiProperty({ description: 'Media name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Short media description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'URL to the uploaded media' })
  @IsUrl()
  content_url: string;

  @ApiProperty({ enum: MediaTypeEnum, description: 'Media file type (e.g., IMAGE, PDF)' })
  @IsEnum(MediaTypeEnum)
  media_type: MediaTypeEnum;

  @ApiProperty({ description: 'Alias for the media file (e.g., document type)' })
  @IsString()
  media_alias: string;

  @ApiProperty({ description: 'Entity ID the media is related to (e.g., job_request.id)' })
  @IsString()
  entity_id: string;

  @ApiProperty({ enum: DocumentEntityTypeEnum, description: 'Entity type (e.g., JOB_REQUEST, SERVICE)' })
  @IsEnum(DocumentEntityTypeEnum)
  entity_type: DocumentEntityTypeEnum;

  @ApiProperty({ description: 'ID of the user who uploaded the media' , type: [UserDto]})
  @Type(() => UserDto)
  @IsUUID()
  uploaded_by: User;
}
