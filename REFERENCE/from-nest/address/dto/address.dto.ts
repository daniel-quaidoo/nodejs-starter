import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsString } from 'class-validator';

// enum
import { AddressType } from '@lib/contracts/address/enums/address-type.enum';

// dto
import { CityDto } from '@app/api-gateway/src/modules/address/city/dto/city.dto';
import { RegionDto } from '@app/api-gateway/src/modules/address/region/dto/region.dto';
import { CountryDto } from '@app/api-gateway/src/modules/address/country/dto/country.dto';

export class AddressDto {
  @ApiProperty({ description: 'address_id' })
  @IsString()
  address_id: string;

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
  address_2: string;

  @ApiProperty({ description: 'address_postal_code' })
  @IsString()
  address_postal_code: string;

  @ApiProperty({ description: 'city', type: [CityDto] })
  @Type(() => CityDto)
  city: CityDto;

  // @ApiProperty({ description: 'region', type: [RegionDto] })
  // @Type(() => RegionDto)
  // region: RegionDto;

  // @ApiProperty({ description: 'country', type: [CountryDto] })
  // @Type(() => CountryDto)
  // country: CountryDto;

}