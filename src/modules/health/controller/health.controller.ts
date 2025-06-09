import { Service } from 'typedi';
import { Request, Response, NextFunction } from 'express';

// service
import { HealthService } from '../service/health.service';

@Service()
export class HealthController {
    constructor(private healthService: HealthService) {}

    async getHealthStatus() {
        return this.healthService.getHealthStatus();
    }

    async checkHealth(_req: Request, res: Response, next: NextFunction) {
        try {
            const healthStatus = await this.getHealthStatus();
            res.status(200).json(healthStatus);
        } catch (error) {
            next(error);
        }
    }
}