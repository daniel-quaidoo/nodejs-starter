import Redis from 'ioredis';

// decorator
import { Service } from '../common/di/component.decorator';

// service
import { ConfigService } from '../../config/configuration';

@Service()
export class RedisService {
    private client: Redis;

    constructor(private configService: ConfigService) {
        this.client = new Redis({
            host: this.configService.get('REDIS_HOST'),
            port: this.configService.get('REDIS_PORT'),
            password: this.configService.get('REDIS_PASSWORD'),
            db: this.configService.get('REDIS_DB'),
        });

        this.client.on('error', err => {
            console.error('Redis error:', err);
        });
    }

    getClient(): Redis {
        return this.client;
    }

    async close(): Promise<void> {
        await this.client.quit();
    }
}
