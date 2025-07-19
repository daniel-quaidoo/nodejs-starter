
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignServicesToCategoriesDto {
  @ApiProperty({ example: ['SVC_SRCH'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  serviceAliases: string[];

  @ApiProperty({ example: ['SEARCH'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  categoryAliases: string[];
}
