import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ description: 'country_name' })
  @IsString()
  country_name: string;
}