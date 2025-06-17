"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDatabaseConfig = void 0;
const typeorm_1 = require("typeorm");
/**
 * Base database configuration class
 * @abstract
 * @implements IDatabaseConfig
 */
class BaseDatabaseConfig {
    constructor() {
        this.dataSource = null;
    }
    /**
     * Retrieves the database configuration
     * @returns The database configuration
     */
    async getConfig() {
        const config = await Promise.resolve().then(() => this.getConnectionConfig());
        return config;
    }
    /**
     * Retrieves the database connection
     * @returns The database connection
     */
    getConnection() {
        if (!this.dataSource) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.dataSource;
    }
    /**
     * Initializes the database connection
     * @returns The initialized database connection
     */
    async initialize() {
        if (!this.dataSource) {
            const config = await this.getConfig();
            this.dataSource = new typeorm_1.DataSource(config);
            await this.dataSource.initialize();
        }
        return this.dataSource;
    }
    /**
     * Retrieves the database connection options
     * @returns The database connection options
     */
    getDataSourceOptions() {
        return this.getConnectionConfig();
    }
    /**
     * Closes the database connection
     */
    async closeConnection() {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.dataSource = null;
        }
    }
    /**
     * Runs database migrations
     */
    async runMigrations() {
        const connection = this.getConnection();
        await connection.runMigrations();
    }
    /**
     * Drops the database
     */
    async dropDatabase() {
        const connection = this.getConnection();
        await connection.dropDatabase();
    }
}
exports.BaseDatabaseConfig = BaseDatabaseConfig;
//# sourceMappingURL=base-database.config.js.map