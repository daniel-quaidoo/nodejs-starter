import 'reflect-metadata';
import { Container } from 'typedi';
import { ConfigService } from '../src/config/configuration';
import { LoggerService } from '../src/core/logging/logger.service';

// Create mock logger
const mockLogger = {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
};

// Create mock config
const mockConfig = {
    get: jest.fn((key: string) => {
        const config = {
            'jwt.secret': 'test-secret',
            'jwt.expiresIn': '1h',
            'database.host': 'localhost',
            'database.port': 5432,
            'database.username': 'test',
            'database.password': 'test',
            'database.database': 'testdb',
            'API_PREFIX': '/api',
            'NODE_ENV': 'test'
        };
        return config[key] || null;
    }),
    getPort: () => parseInt(process.env.PORT || '3000', 10),
    getEnv: () => 'test',
    isDevelopment: () => false,
    isTest: () => true,
};

// Set up test environment
beforeAll(() => {
    // Set test environment variables
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';

    // Register mocks in the container
    Container.set(LoggerService, mockLogger);
    Container.set(ConfigService, mockConfig);
});

// Reset mocks between tests
afterEach(() => {
    jest.clearAllMocks();
});

// Export mocks for use in tests
export { mockLogger, mockConfig };
