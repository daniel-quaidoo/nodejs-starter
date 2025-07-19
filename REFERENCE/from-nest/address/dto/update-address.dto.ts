import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

// enum
import { AddressType } from '@lib/contracts/address/enums/address-type.enum';

// dto
import { CityDto } from '@app/api-gateway/src/modules/address/city/dto/city.dto';
import { RegionDto } from '@app/api-gateway/src/modules/address/region/dto/region.dto';
import { CountryDto } from '@app/api-gateway/src/modules/address/country/dto/country.dto';

export class UpdateAddressDto {
  @ApiProperty({ required: false, description: 'address_id' })
  @IsString()
  @IsOptional()
  address_id?: string;

  @ApiProperty({ required: false, description: 'address_type', enum: AddressType })
  @IsEnum(AddressType)
  @IsOptional()
  address_type?: AddressType;

  @ApiProperty({ required: false, description: 'primary' })
  @IsString()
  @IsOptional()
  primary?: Boolean;

  @ApiProperty({ required: false, description: 'address_1' })
  @IsString()
  @IsOptional()
  address_1?: string;

  @ApiProperty({ required: false, description: 'address_2' })
  @IsString()
  @IsOptional()
  address_2?: string;

  @ApiProperty({ required: false, description: 'address_postal_code' })
  @IsString()
  @IsOptional()
  address_postal_code?: string;

  @ApiProperty({ description: 'city_name' })
  @IsString()
  @IsOptional()
  city_name?: string;

  @ApiProperty({ description: 'region_name' })
  @IsString()
  @IsOptional()
  region_name?: string;

  @ApiProperty({ description: 'country_name' })
  @IsString()
  @IsOptional()
  country_name?: string;

  // @ApiProperty({ required: false, description: 'city', type: [CityDto] })
  // @IsOptional()
  // @Type(() => CityDto)
  // city?: CityDto;

  // @ApiProperty({ required: false, description: 'region', type: [RegionDto] })
  // @IsOptional()
  // @Type(() => RegionDto)
  // region?: RegionDto;

  // @ApiProperty({ required: false, description: 'country', type: [CountryDto] })
  // @IsOptional()
  // @Type(() => CountryDto)
  // country?: CountryDto;

}