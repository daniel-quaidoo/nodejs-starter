// service
import { RedisService } from "./redis.service";

// decorator
import { Module } from "../common/di/module.decorator";

@Module({
    services: [RedisService],
    exports: [RedisService]
})
export class RedisModule { }
