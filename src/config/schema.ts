import * as Joi from 'joi';

export const configSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

    PORT: Joi.number().default(3000),

    // Database
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_DATABASE: Joi.string().required(),

    // Logging
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly')
        .default('info'),

    // API
    API_PREFIX: Joi.string().default('/api'),

    // Security
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1h'),

    // CORS
    CORS_ORIGIN: Joi.string().default('*'),
    CORS_METHODS: Joi.string().default('GET,HEAD,PUT,PATCH,POST,DELETE'),
    CORS_CREDENTIALS: Joi.boolean().default(true),
});

export type ConfigSchema = {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;
    DB_HOST: string;
    DB_PORT: number;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_DATABASE: string;
    LOG_LEVEL: string;
    API_PREFIX: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
    CORS_METHODS: string;
    CORS_CREDENTIALS: boolean;
};
