import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';

export class BaseDto<T = any> {
    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    query?: Record<string, any>;

    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    body?: T;

    @IsOptional()
    @ValidateNested()
    @Type(() => Object)
    params?: Record<string, any>;
}
