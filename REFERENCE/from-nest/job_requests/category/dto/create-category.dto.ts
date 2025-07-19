import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../service/entities/service.entity';

export class CreateCategoryDto {
    @ApiProperty({example: 'SEARCH', description: 'The name of the category',})
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({example: 'SEARCH', description: 'The alias or slug for the category',})
    @IsString()
    @IsNotEmpty()
    alias: string;

    @ApiProperty({example: 'All searching related jobs',description: 'A brief description of the category',})
    @IsString()
    description: string;

    services: Service[];
}
