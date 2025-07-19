

import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, ArrayNotEmpty } from 'class-validator';

export class RemoveServiceFromCategoriesDto {
  @ApiProperty({ example: 'SVC_SRCH', description: 'The alias of the service to unlink' })
  @IsNotEmpty()
  @IsString()
  serviceAlias: string;

  @ApiProperty({
    example: ['SEARCH', 'REGISTRATION'],
    description: 'Array of category aliases to unlink the service from',
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  categoryAliases: string[];
}
