// service
import { HealthService } from './health.service';

// decorator
import { Controller, Get } from '../../core/common/decorators/route.decorator';

@Controller('/health')
export class HealthController {
    constructor(private healthService: HealthService) {}

    /**
     * Retrieves the health status of the system
     * @returns The health status of the system
     */
    @Get('status')
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
    @Get('check')
    public async checkHealth(): Promise<any> {
        try {
            return await this.healthService.getHealthStatus();
        } catch {
            throw new Error('Failed to get health status');
        }
    }
}
