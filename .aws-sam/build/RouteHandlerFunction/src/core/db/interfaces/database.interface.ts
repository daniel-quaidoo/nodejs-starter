import { DataSource, DataSourceOptions } from 'typeorm';

export enum DatabaseType {
    MYSQL = 'mysql',
    SQLITE = 'sqlite',
    MONGODB = 'mongodb',
    POSTGRES = 'postgres',
}

export interface IDatabaseConfig {
    initialize(): Promise<DataSource>;
    getConnection(): DataSource;
    closeConnection(): Promise<void>;
    runMigrations(): Promise<void>;
    dropDatabase(): Promise<void>;
    getDataSourceOptions(): DataSourceOptions;
}