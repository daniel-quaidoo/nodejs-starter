import { IsOptional, IsNumberString, IsString, IsIn } from 'class-validator';

// factory
import { queryBuilderFactory } from '../factory/query-builder.factory';

export class BaseQueryDto {
    @IsOptional()
    @IsNumberString()
    page?: string;

    @IsOptional()
    @IsNumberString()
    limit?: string;

    @IsOptional()
    @IsString()
    sortBy?: string;

    @IsOptional()
    @IsIn(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';

    @IsOptional()
    @IsString()
    search?: string;

    /**
     * Transforms the DTO into database-specific query options
     * @param dbType The database type to generate options for
     */
    toFindOptions<T>(dbType: 'typeorm' | 'mongodb' = 'typeorm'): any {
        const page = parseInt(this.page || '1', 10);
        const limit = parseInt(this.limit || '10', 10);

        const builder = queryBuilderFactory.create<T>(dbType);
        return builder.buildFindOptions({ ...this, page, limit });
    }
}
