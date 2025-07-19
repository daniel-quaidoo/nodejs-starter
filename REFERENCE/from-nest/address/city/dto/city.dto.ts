import { Type } from 'class-transformer';
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

// dto
import { RegionDto } from '@app/api-gateway/src/modules/address/region/dto/region.dto';

export class CityDto {
  @ApiProperty({ description: 'city_id' })
  @IsString()
  city_id: string;

  @ApiProperty({ description: 'city_name' })
  @IsString()
  city_name: string;

  @ApiProperty({ description: 'region', type: [RegionDto] })
  @Type(() => RegionDto)
  region: RegionDto;

}