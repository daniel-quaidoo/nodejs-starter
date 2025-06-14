import { DataSourceOptions } from 'typeorm';

// config
import { BaseDatabaseConfig } from './base-database.config';

export class MongodbConfig extends BaseDatabaseConfig {
    /**
     * Retrieves the MongoDB connection configuration
     * @returns The MongoDB connection configuration
     */
    protected getConnectionConfig(): DataSourceOptions {
        return {
            type: 'mongodb',
            url: process.env.MONGO_URI || 'mongodb://localhost:27017/myapp',
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
            authSource: 'admin',
            database: process.env.MONGO_DB_NAME || 'myapp',
        };
    }
}
