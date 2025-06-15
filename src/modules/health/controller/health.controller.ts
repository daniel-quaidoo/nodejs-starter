import { Request, Response, NextFunction } from 'express';

// service
import { HealthService } from '../service/health.service';
import { Controller, Get } from '../../../core/common/decorators/route.decorator';
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';
import { authMiddleware } from '../../../core/auth/guards/local.guard';

@Controller('/healthy')
@UseMiddleware(authMiddleware({ roles: ['admin'] }))
export class HealthController {
    constructor(private healthService: HealthService) {}

    /**
     * Retrieves the health status of the system
     * @param _req The request object
     * @param res The response object
     * @returns The health status of the system
     */
    @Get('/status')
    public async getHealthStatus(_req: Request, res: Response): Promise<void> {
        try {
            const status = await this.healthService.getHealthStatus();
            res.status(200).json(status);
        } catch {
            res.status(500).json({ error: 'Failed to get health status' });
        }
    }

    /**
     * Checks the health of the system
     * @param _req The request object
     * @param res The response object
     * @param next The next function
     * @returns The health status of the system
     */
    @Get('/check')
    public async checkHealth(_req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.getHealthStatus(_req, res);
        } catch (error) {
            next(error);
        }
    }
}
