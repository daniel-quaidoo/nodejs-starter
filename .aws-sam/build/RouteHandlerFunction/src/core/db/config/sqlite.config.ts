import { DataSourceOptions } from 'typeorm';

// config
import { BaseDatabaseConfig } from './base-database.config';

export class SqliteConfig extends BaseDatabaseConfig {
    protected getConnectionConfig(): DataSourceOptions {
        return {
            type: 'better-sqlite3',
            database: process.env.SQLITE_PATH || './database.sqlite',
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        };
    }
}
