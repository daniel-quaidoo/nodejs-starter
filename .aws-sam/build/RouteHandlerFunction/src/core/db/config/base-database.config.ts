import { DataSource, DataSourceOptions } from 'typeorm';

// interface
import { IDatabaseConfig } from '../interfaces/database.interface';

export abstract class BaseDatabaseConfig implements IDatabaseConfig {
    protected dataSource: DataSource | null = null;
    protected abstract getConnectionConfig(): DataSourceOptions;

    async getConfig(): Promise<DataSourceOptions> {
        return this.getConnectionConfig();
    }

    getConnection(): DataSource {
        if (!this.dataSource) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.dataSource;
    }

    async initialize(): Promise<DataSource> {
        if (!this.dataSource) {
            const config = await this.getConfig();
            this.dataSource = new DataSource(config);
            await this.dataSource.initialize();
        }
        return this.dataSource;
    }

    getDataSourceOptions(): DataSourceOptions {
        return this.getConnectionConfig();
    }

    async closeConnection(): Promise<void> {
        if (this.dataSource && this.dataSource.isInitialized) {
            await this.dataSource.destroy();
            this.dataSource = null;
        }
    }

    async runMigrations(): Promise<void> {
        const connection = this.getConnection();
        await connection.runMigrations();
    }

    async dropDatabase(): Promise<void> {
        const connection = this.getConnection();
        await connection.dropDatabase();
    }
}
