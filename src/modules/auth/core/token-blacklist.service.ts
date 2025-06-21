import { Redis } from 'ioredis';
import { Service } from 'typedi';

// service
import { RedisService } from '../../../core/redis/redis.service';

@Service()
export class TokenBlacklistService {
    private readonly PREFIX = 'blacklist:';

    constructor(private redisService: RedisService) {}

    private get client(): Redis {
        return this.redisService.getClient() as Redis;
    }

    async addToBlacklist(token: string, expiresIn: number): Promise<void> {
        await this.client.set(`${this.PREFIX}${token}`, '1', 'EX', expiresIn);
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const result = await this.client.exists(`${this.PREFIX}${token}`);
        return result === 1;
    }
}
