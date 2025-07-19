import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString } from 'class-validator';

// dto
import { RegionDto } from '@app/api-gateway/src/modules/address/region/dto/region.dto';

export class UpdateCityDto {
  @ApiProperty({ required: false, description: 'city_id' })
  @IsString()
  @IsOptional()
  city_id?: string;

  @ApiProperty({ required: false, description: 'city_name' })
  @IsString()
  @IsOptional()
  city_name?: string;

  @ApiProperty({ required: false, description: 'region', type: [RegionDto] })
  @IsArray()
  @IsOptional()
  @Type(() => RegionDto)
  region?: RegionDto;

}