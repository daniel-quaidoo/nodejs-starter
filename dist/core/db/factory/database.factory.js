"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseFactory = void 0;
// config
const mysql_config_1 = require("../config/mysql.config");
const sqlite_config_1 = require("../config/sqlite.config");
const mongodb_config_1 = require("../config/mongodb.config");
const postgres_config_1 = require("../config/postgres.config");
// interface
const database_interface_1 = require("../interfaces/database.interface");
class DatabaseFactory {
    static createDatabaseConfig(type = database_interface_1.DatabaseType.POSTGRES) {
        switch (type) {
            case database_interface_1.DatabaseType.POSTGRES:
                return new postgres_config_1.PostgresConfig();
            case database_interface_1.DatabaseType.MYSQL:
                return new mysql_config_1.MySqlConfig();
            case database_interface_1.DatabaseType.SQLITE:
                return new sqlite_config_1.SqliteConfig();
            case database_interface_1.DatabaseType.MONGODB:
                return new mongodb_config_1.MongodbConfig();
            default:
                throw new Error(`Unsupported database type: ${type}`);
        }
    }
}
exports.DatabaseFactory = DatabaseFactory;
//# sourceMappingURL=database.factory.js.map