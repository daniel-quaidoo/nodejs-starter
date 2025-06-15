"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostgresConfig = void 0;
// config
const base_database_config_1 = require("./base-database.config");
class PostgresConfig extends base_database_config_1.BaseDatabaseConfig {
    /**
     * Retrieves the PostgreSQL connection configuration
     * @returns The PostgreSQL connection configuration
     */
    getConnectionConfig() {
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
exports.PostgresConfig = PostgresConfig;
//# sourceMappingURL=postgres.config.js.map