import { Request, Response, NextFunction } from 'express';
import { HealthController } from '../health.controller';
import { HealthService } from '../health.service';
import { HealthCheckResult } from '../interface/health.interface';

// Mock the route decorator to bypass Express functionality in tests
jest.mock('../../../../src/core/common/decorators/route.decorator', () => ({
    Controller: () => (target: any) => target,
    Get: () => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        // Replace the original method with a version that calls it directly
        const originalMethod = descriptor.value;
        descriptor.value = async function(...args: any[]) {
            try {
                // Call the original method without Express args
                return await originalMethod.apply(this, args);
            } catch (error) {
                throw error;
            }
        };
        return descriptor;
    }
}));

describe('HealthController', () => {
    let healthController: HealthController;
    let healthService: jest.Mocked<HealthService>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: jest.Mock<NextFunction>;
    let responseJson: jest.Mock;
    let responseStatus: jest.Mock;

    const createMockHealthStatus = (): HealthCheckResult => ({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        node: {
            id: 'test-node-1',
            hostname: 'test-host',
            platform: 'test',
            arch: 'test',
            uptime: 1000
        },
        services: {
            database: {
                status: 'connected',
                responseTime: 10
            }
        },
        details: {}
    });

    beforeEach(() => {
        // Create a fresh mock for each test
        healthService = {
            getHealthStatus: jest.fn()
        } as any;

        // Create a new instance of the controller for each test
        healthController = new HealthController(healthService);
        
        // Reset all mocks before each test
        jest.clearAllMocks();
    });

    describe('checkHealth', () => {
        it('should return health status', async () => {
            // Arrange
            const mockStatus = createMockHealthStatus();
            healthService.getHealthStatus.mockResolvedValue(mockStatus);

            // Act
            const result = await healthController.checkHealth();

            // Assert
            expect(healthService.getHealthStatus).toHaveBeenCalled();
            expect(result).toEqual(mockStatus);
        });

        it('should handle errors', async () => {
            // Arrange
            const error = new Error('Health check failed');
            healthService.getHealthStatus.mockRejectedValue(error);

            // Act & Assert
            await expect(healthController.checkHealth())
                .rejects
                .toThrow('Failed to get health status');
        });
    });

    describe('getHealthStatus', () => {
        it('should return health status', async () => {
            // Arrange
            const mockStatus = createMockHealthStatus();
            healthService.getHealthStatus.mockResolvedValue(mockStatus);

            // Act
            const result = await healthController.getHealthStatus();

            // Assert
            expect(healthService.getHealthStatus).toHaveBeenCalled();
            expect(result).toEqual(mockStatus);
        });

        it('should handle errors', async () => {
            // Arrange
            const error = new Error('Health check failed');
            healthService.getHealthStatus.mockRejectedValue(error);

            // Act & Assert
            await expect(healthController.getHealthStatus())
                .rejects
                .toThrow('Failed to get health status');
        });
    });
});
