import * as path from 'path';
import { Service } from 'typedi';
import * as dotenv from 'dotenv';

// schema
import { configSchema, ConfigSchema } from './schema';

@Service()
export class ConfigService {
    private config: ConfigSchema;

    constructor() {
        // load .env file
        dotenv.config({
            path: path.resolve(process.cwd(), '.env')
        });

        // validate configuration
        const { error, value } = configSchema.validate(process.env, {
            allowUnknown: true,
            stripUnknown: true,
            abortEarly: false,
        });

        if (error) {
            throw new Error(`Configuration validation error: ${error.message}`);
        }

        this.config = value as unknown as ConfigSchema;
    }

    get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T] {
        return this.config[key];
    }

    isProduction(): boolean {
        return this.config.NODE_ENV === 'production';
    }

    isDevelopment(): boolean {
        return this.config.NODE_ENV === 'development';
    }

    isTest(): boolean {
        return this.config.NODE_ENV === 'test';
    }
}
