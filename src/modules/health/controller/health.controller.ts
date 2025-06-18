// service
import { HealthService } from '../service/health.service';

// guard
import { authMiddleware } from '../../../core/auth/guards/local.guard';

// decorator
import { Controller, Get } from '../../../core/common/decorators/route.decorator';
import { UseMiddleware } from '../../../core/common/decorators/middleware.decorator';

@Controller('/healthy')
@UseMiddleware(authMiddleware({ roles: ['admin'] }))
export class HealthController {
    constructor(private healthService: HealthService) {}

    /**
     * Retrieves the health status of the system
     * @returns The health status of the system
     */
    @Get('/status')
    public async getHealthStatus(): Promise<any> {
        try {
            const status = await this.healthService.getHealthStatus();
            return status;
        } catch {
            throw new Error('Failed to get health status');
        }
    }

    /**
     * Checks the health of the system
     * @returns The health status of the system
     */
    @Get('/check')
    public async checkHealth(): Promise<any> {
        try {
            await this.getHealthStatus();
        } catch (error) {
            throw error;
        }
    }
}
