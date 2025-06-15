import 'reflect-metadata';
import { Container } from 'typedi';
import { DataSource } from 'typeorm';

// Mock database connection for tests
const mockDataSource = {
    query: jest.fn(),
    getRepository: jest.fn(),
    initialize: jest.fn().mockResolvedValue(undefined),
    destroy: jest.fn().mockResolvedValue(undefined),
} as unknown as DataSource;

// Global test setup
beforeAll(async () => {
    Container.set('DATA_SOURCE', mockDataSource);
});

afterEach(() => {
    jest.clearAllMocks();
});

afterAll(async () => {
    await Container.reset();
});

export { mockDataSource };
