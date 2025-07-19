import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CountryDto {
  @ApiProperty({ description: 'country_id' })
  @IsString()
  country_id: string;

  @ApiProperty({ description: 'country_name' })
  @IsString()
  country_name: string;
}