import { DataSource, DataSourceOptions } from 'typeorm';

// interface
import { IDatabaseConfig } from '../interfaces/database.interface';

/**
 * Base database configuration class
 * @abstract
 * @implements IDatabaseConfig
 */
export abstract class BaseDatabaseConfig implements IDatabaseConfig {
    protected dataSource: DataSource | null = null;
    protected abstract getConnectionConfig(): DataSourceOptions;

    /**
     * Retrieves the database configuration
     * @returns The database configuration
     */
    async getConfig(): Promise<DataSourceOptions> {
        const config = await Promise.resolve().then(() => this.getConnectionConfig());
        return config;
    }

    /**
     * Retrieves the database connection
     * @returns The database connection
     */
    getConnection(): DataSource {
        if (!this.dataSource) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.dataSource;
    }

    /**
     * Initializes the database connection
     * @returns The initialized database connection
     */
    async initialize(): Promise<DataSource> {
        if (!this.dataSource) {
            const config = await this.getConfig();
            this.dataSource = new DataSource(config);
            await this.dataSource.initialize();
        }
        return this.dataSource;
    }

    /**
     * Retrieves the database connection options
     * @returns The database connection options
     */
    getDataSourceOptions(): DataSourceOptions {
        return this.getConnectionConfig();
    }

    /**
     * Closes the database connection
     */
    async closeConnection(): Promise<void> {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.dataSource = null;
        }
    }

    /**
     * Runs database migrations
     */
    async runMigrations(): Promise<void> {
        const connection = this.getConnection();
        await connection.runMigrations();
    }

    /**
     * Drops the database
     */
    async dropDatabase(): Promise<void> {
        const connection = this.getConnection();
        await connection.dropDatabase();
    }
}
