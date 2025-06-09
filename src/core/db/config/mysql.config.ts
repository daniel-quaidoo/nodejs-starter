import { DataSourceOptions } from 'typeorm';

// config
import { BaseDatabaseConfig } from './base-database.config';

export class MySqlConfig extends BaseDatabaseConfig {
    protected getConnectionConfig(): DataSourceOptions {
        return {
            type: 'mysql',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306', 10),
            username: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'myapp',
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
            migrations: [`${__dirname}/../../migrations/*{.ts,.js}`],
            migrationsTableName: 'migrations',
            timezone: 'Z', // Use UTC timezone
            charset: 'utf8mb4',
            supportBigNumbers: true,
            bigNumberStrings: false,
        };
    }
}
