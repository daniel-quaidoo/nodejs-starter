import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

// enum
import { AddressType } from '@lib/contracts/address/enums/address-type.enum';

// dto
import { CityDto } from '@app/api-gateway/src/modules/address/city/dto/city.dto';
import { RegionDto } from '@app/api-gateway/src/modules/address/region/dto/region.dto';
import { CountryDto } from '@app/api-gateway/src/modules/address/country/dto/country.dto';

export class CreateAddressDto {
  @ApiProperty({ description: 'address_type', enum: AddressType })
  @IsEnum(AddressType)
  address_type: AddressType;

  @ApiProperty({ description: 'primary' })
  primary: boolean;

  @ApiProperty({ description: 'address_1' })
  @IsString()
  address_1: string;

  @ApiProperty({ required: false, description: 'address_2' })
  @IsString()
  @IsOptional()
  address_2?: string;

  @ApiProperty({ description: 'address_postal_code' })
  @IsString()
  address_postal_code: string;
  
  @ApiProperty({ description: 'city_name' })
  @IsString()
  city_name: string;

  @ApiProperty({ description: 'region_name' })
  @IsString()
  region_name: string;

  @ApiProperty({ description: 'country_name' })
  @IsString()
  country_name: string;
  
  // @ApiProperty({ description: 'city', type: [CityDto] })
  // @IsOptional()
  // @Type(() => CityDto)
  // city: CityDto;

  // @ApiProperty({ description: 'region', type: [RegionDto] })
  // @IsOptional()
  // @Type(() => RegionDto)
  // region: RegionDto;

  // @ApiProperty({ description: 'country', type: [CountryDto] })
  // @IsOptional()
  // @Type(() => CountryDto)
  // country: CountryDto;

}