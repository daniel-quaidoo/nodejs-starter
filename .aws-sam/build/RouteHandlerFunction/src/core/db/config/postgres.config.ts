import { DataSourceOptions } from 'typeorm';

// config
import { BaseDatabaseConfig } from './base-database.config';

export class PostgresConfig extends BaseDatabaseConfig {
    protected getConnectionConfig(): DataSourceOptions {
        return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432', 10),
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'postgres',
            database: process.env.DB_NAME || 'myapp',
            entities: [`${__dirname}/../../../**/*.entity{.ts,.js}`],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
            migrations: [`${__dirname}/../../../migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations',
        };
    }
}
