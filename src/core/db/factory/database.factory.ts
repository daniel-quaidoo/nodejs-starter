// config
import { MySqlConfig } from '../config/mysql.config';
import { SqliteConfig } from '../config/sqlite.config';
import { MongodbConfig } from '../config/mongodb.config';
import { PostgresConfig } from '../config/postgres.config';

// interface
import { IDatabaseConfig, DatabaseType } from '../interfaces/database.interface';

/**
 * Database factory class
 * @class
 * @implements IDatabaseConfig
 */
export class DatabaseFactory {
    /**
     * Creates a database configuration instance
     * @param type The type of database to create
     * @returns The database configuration instance
     */
    public static createDatabaseConfig(
        type: DatabaseType = DatabaseType.POSTGRES
    ): IDatabaseConfig {
        switch (type) {
            case DatabaseType.POSTGRES:
                return new PostgresConfig();
            case DatabaseType.MYSQL:
                return new MySqlConfig();
            case DatabaseType.SQLITE:
                return new SqliteConfig();
            case DatabaseType.MONGODB:
                return new MongodbConfig();
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
}
