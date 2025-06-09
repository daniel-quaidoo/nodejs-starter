"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteConfig = void 0;
// config
const base_database_config_1 = require("./base-database.config");
class SqliteConfig extends base_database_config_1.BaseDatabaseConfig {
    getConnectionConfig() {
        return {
            type: 'better-sqlite3',
            database: process.env.SQLITE_PATH || './database.sqlite',
            entities: [`${__dirname}/../../**/*.entity{.ts,.js}`],
            synchronize: process.env.NODE_ENV !== 'production',
            logging: process.env.NODE_ENV === 'development',
        };
    }
}
exports.SqliteConfig = SqliteConfig;
//# sourceMappingURL=sqlite.config.js.map