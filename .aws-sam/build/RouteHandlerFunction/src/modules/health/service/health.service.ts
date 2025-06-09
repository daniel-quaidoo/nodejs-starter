import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { DataSource } from 'typeorm';
import { Container, Service } from 'typedi';

export interface HealthCheckResult {
    status: 'healthy' | 'degraded' | 'unhealthy';
    timestamp: string;
    node: {
        id: string;
        hostname: string;
        platform: string;
        arch: string;
        uptime: number;
    };
    services: {
        database: {
            status: 'connected' | 'disconnected';
            responseTime?: number;
            error?: string;
        };
    };
    details?: Record<string, unknown>;
}

@Service()
export class HealthService {
    private dataSource: DataSource;
    private readonly nodeId: string;

    constructor() {
        this.dataSource = Container.get(DataSource);
        this.nodeId = process.env.NODE_ID || uuidv4();
    }

    private async checkDatabase(): Promise<{
        status: boolean;
        responseTime?: number;
        error?: string;
    }> {
        const startTime = process.hrtime();
        try {
            await this.dataSource.query('SELECT 1');
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const responseTime = Math.round((seconds * 1000) + (nanoseconds / 1000000));
            return { status: true, responseTime };
        } catch (error) {
            return { 
                status: false, 
                error: error instanceof Error ? error.message : 'Unknown database error'
            };
        }
    }

    private getSystemInfo() {
        return {
            id: this.nodeId,
            hostname: os.hostname(),
            platform: process.platform,
            arch: process.arch,
            uptime: process.uptime(),
            memory: {
                total: os.totalmem(),
                free: os.freemem(),
                used: process.memoryUsage().heapUsed,
                rss: process.memoryUsage().rss,
            },
            load: os.loadavg(),
            cpus: os.cpus().length,
        };
    }

    async getHealthStatus(): Promise<HealthCheckResult> {
        const systemInfo = this.getSystemInfo();
        const databaseCheck = await this.checkDatabase();
        
        const allServicesHealthy = databaseCheck.status;
        const status = allServicesHealthy ? 'healthy' : 'unhealthy';

        return {
            status,
            timestamp: new Date().toISOString(),
            node: {
                id: systemInfo.id,
                hostname: systemInfo.hostname,
                platform: systemInfo.platform,
                arch: systemInfo.arch,
                uptime: systemInfo.uptime,
            },
            services: {
                database: {
                    status: databaseCheck.status ? 'connected' : 'disconnected',
                    responseTime: databaseCheck.responseTime,
                    ...(databaseCheck.error ? { error: databaseCheck.error } : {})
                },
            },
            details: {
                memory: systemInfo.memory,
                load: systemInfo.load,
                cpus: systemInfo.cpus,
            },
        };
    }
}
