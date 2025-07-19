import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Service } from '../../service/entities/service.entity';

export class CategoryDto {

    @ApiProperty({example: '31dc513a-b801-444f-894d-41bcba1b42563', description: 'The unique identifier for the category',})
    @IsUUID()
    id: string;

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