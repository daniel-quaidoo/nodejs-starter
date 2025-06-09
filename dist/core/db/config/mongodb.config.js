"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongodbConfig = void 0;
// config
const base_database_config_1 = require("./base-database.config");
class MongodbConfig extends base_database_config_1.BaseDatabaseConfig {
    getConnectionConfig() {
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
exports.MongodbConfig = MongodbConfig;
//# sourceMappingURL=mongodb.config.js.map