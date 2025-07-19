import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsNotEmpty, IsNumber, IsBoolean, IsPositive } from 'class-validator';
import { Category } from '../../category/entities/category.entity';


export class CreateServiceDto {

    @ApiProperty({ example: 'Official Search', description: 'The name of the service' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'SVC_SRCH', description: 'The alias or slug for the service' })
    @IsString()
    @IsNotEmpty()
    alias: string;

    @ApiProperty({ example: 1, description: 'The priority level of the service' })
    @IsNumber()
    @IsNotEmpty()
    priority: number;

    @ApiProperty({ example: 'This is a serivce type', description: 'A description of the service' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 500, description: 'The land size associated with the service (in square meters or preferred unit)' })
    @IsNumber()
    @IsPositive()
    land_size: number;

    @ApiProperty({ example: 'East Legon', description: 'The locality where the service is provided' })
    @IsString()
    @IsNotEmpty()
    locality: string;

    @ApiProperty({ example: true, description: 'Indicates if the service is at a particular stage' })
    @IsBoolean()
    stage: boolean;

    @ApiProperty({ example: 30, description: 'The duration of the service (in days)' })
    @IsNumber()
    @IsPositive()
    duration: number;

    @ApiProperty({ example: 1500.00, description: 'The cost of the service' })
    @IsNumber()
    @IsPositive()
    cost: number;

    @ApiProperty({ example: 'Greater Accra', description: 'The region where the service is available' })
    @IsString()
    @IsNotEmpty()
    region: string;

    categories: Category[]
}
