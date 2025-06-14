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
