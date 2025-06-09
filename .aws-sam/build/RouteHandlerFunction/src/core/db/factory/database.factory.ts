// config
import { MySqlConfig } from '../config/mysql.config';
import { SqliteConfig } from '../config/sqlite.config';
import { MongodbConfig } from '../config/mongodb.config';
import { PostgresConfig } from '../config/postgres.config';

// interface
import { IDatabaseConfig, DatabaseType } from '../interfaces/database.interface';

export class DatabaseFactory {
    public static createDatabaseConfig(type: DatabaseType = DatabaseType.POSTGRES): IDatabaseConfig {
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
