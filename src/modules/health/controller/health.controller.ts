import { Request, Response, NextFunction } from 'express';

// service
import { HealthService } from '../service/health.service';
import { Controller, Get } from '../../../core/common/decorators/route.decorator';

@Controller('/healthy')
export class HealthController {
    constructor(private healthService: HealthService) {}

    @Get('/status') 
    public async getHealthStatus(_req: Request, res: Response) {
        try {
            const status = await this.healthService.getHealthStatus();
            res.status(200).json(status);
        } catch (error) {
            res.status(500).json({ error: 'Failed to get health status' });
        }
    }

    @Get('/check')
    public async checkHealth(_req: Request, res: Response, next: NextFunction) {
        try {
            const healthStatus = await this.getHealthStatus(_req, res);
            res.status(200).json(healthStatus);
        } catch (error) {
            next(error);
        }
    }
}