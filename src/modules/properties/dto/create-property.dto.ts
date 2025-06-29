import { IsString, IsInt, IsBoolean, IsDecimal, IsOptional } from 'class-validator';

export class CreatePropertyDto {
    @IsString()
    name: string;

    @IsString()
    propertyType: string;

    @IsDecimal()
    amount: number;

    @IsDecimal()
    securityDeposit: number;

    @IsDecimal()
    commission: number;

    @IsDecimal()
    floorSpace: number;

    @IsInt()
    numUnits: number;

    @IsInt()
    numBathrooms: number;

    @IsInt()
    numGarages: number;

    @IsBoolean()
    hasBalconies: boolean;

    @IsBoolean()
    hasParkingSpace: boolean;

    @IsBoolean()
    petsAllowed: boolean;

    @IsString()
    @IsOptional()
    description?: string;
}
