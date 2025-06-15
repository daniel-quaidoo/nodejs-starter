import winston from 'winston';
import { Service } from 'typedi';

/**
 * Logger service that wraps Winston for application-wide logging.
 * Provides consistent logging interface throughout the application.
 */
@Service()
export class LoggerService {
    private logger: winston.Logger;

    constructor() {
        const { combine, timestamp, json } = winston.format;

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(timestamp(), json()),
            defaultMeta: {
                service: process.env.SERVICE_NAME || 'nodejs-starter',
                environment: process.env.NODE_ENV || 'development',
            },
            transports: [
                new winston.transports.Console({
                    format:
                        process.env.NODE_ENV === 'development'
                            ? winston.format.combine(
                                  winston.format.colorize(),
                                  winston.format.simple()
                              )
                            : winston.format.json(),
                }),
            ],
        });
    }

    /**
     * Log an info message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    info(message: string, meta?: Record<string, any>): void {
        this.logger.info(message, meta);
    }

    /**
     * Log an error message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    error(message: string, meta?: Record<string, any>): void {
        this.logger.error(message, meta);
    }

    /**
     * Log a warning message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    warn(message: string, meta?: Record<string, any>): void {
        this.logger.warn(message, meta);
    }

    /**
     * Log a debug message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    debug(message: string, meta?: Record<string, any>): void {
        if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(message, meta);
        }
    }

    /**
     * Create a child logger with additional default metadata
     * @param meta Default metadata to include in all logs from the child logger
     */
    child(meta: Record<string, any>): LoggerService {
        const childLogger = new LoggerService();
        childLogger.logger = this.logger.child(meta);
        return childLogger;
    }
}
