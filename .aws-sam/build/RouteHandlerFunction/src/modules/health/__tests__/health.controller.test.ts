import { Request, Response } from 'express';
import { HealthController } from '../controller/health.controller';
import { HealthService } from '../service/health.service';

describe('HealthController', () => {
    let healthController: HealthController;
    let healthService: jest.Mocked<HealthService>;
    let mockRequest: Partial<Request> = {};
    let mockResponse: Partial<Response> = {};
    let responseObject: any = {};

    beforeEach(() => {
        healthService = {
            checkDatabase: jest.fn(),
            getHealthStatus: jest.fn()
        } as any;

        healthController = new HealthController(healthService);

        responseObject = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockImplementation((result) => {
                responseObject = result;
                return mockResponse as Response;
            })
        };
    });

    describe('checkHealth', () => {
        it('should return health status', async () => {
            const mockStatus = {
                status: 'healthy',
                timestamp: '2023-01-01T00:00:00.000Z',
                services: { database: 'connected' }
            };

            healthService.getHealthStatus.mockResolvedValue(mockStatus as any);

            await healthController.checkHealth(
                mockRequest as Request,
                mockResponse as Response,
                jest.fn()
            );

            expect(mockResponse.json).toHaveBeenCalledWith(mockStatus);
        });
    });
});
