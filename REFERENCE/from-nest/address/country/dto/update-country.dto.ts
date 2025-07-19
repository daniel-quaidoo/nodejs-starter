import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCountryDto {
  @ApiProperty({ required: false, description: 'country_id' })
  @IsString()
  @IsOptional()
  country_id?: string;

  @ApiProperty({ required: false, description: 'country_name' })
  @IsString()
  @IsOptional()
  country_name?: string;

}