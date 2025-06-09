"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDatabaseConfig = void 0;
const typeorm_1 = require("typeorm");
class BaseDatabaseConfig {
    constructor() {
        this.dataSource = null;
    }
    async getConfig() {
        return this.getConnectionConfig();
    }
    getConnection() {
        if (!this.dataSource) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.dataSource;
    }
    async initialize() {
        if (!this.dataSource) {
            const config = await this.getConfig();
            this.dataSource = new typeorm_1.DataSource(config);
            await this.dataSource.initialize();
        }
        return this.dataSource;
    }
    getDataSourceOptions() {
        return this.getConnectionConfig();
    }
    async closeConnection() {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.dataSource = null;
        }
    }
    async runMigrations() {
        const connection = this.getConnection();
        await connection.runMigrations();
    }
    async dropDatabase() {
        const connection = this.getConnection();
        await connection.dropDatabase();
    }
}
exports.BaseDatabaseConfig = BaseDatabaseConfig;
//# sourceMappingURL=base-database.config.js.map