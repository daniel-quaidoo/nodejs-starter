import winston from 'winston';
import Container, { Service } from 'typedi';

/**
 * Logger service that wraps Winston for application-wide logging.
 * Provides consistent logging interface throughout the application.
 */
@Service({ global: true })
export class LoggerService {
    public readonly logger: winston.Logger;

    constructor() {
        const { combine, timestamp, json, printf } = winston.format;

        // Custom format for development
        const devFormat = printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
            return `${timestamp} ${level}: ${message}${metaString}`;
        });

        this.logger = winston.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.errors({ stack: true }),
                process.env.NODE_ENV === 'production'
                    ? json()
                    : winston.format.combine(winston.format.colorize(), devFormat)
            ),
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
                    handleExceptions: true,
                    handleRejections: true,
                }),
            ],
            exitOnError: false, // Don't exit on handled exceptions
        });

        // Handle uncaught exceptions and rejections in production
        if (process.env.NODE_ENV === 'production') {
            process
                .on('unhandledRejection', reason => {
                    this.logger.error('Unhandled Rejection at Promise', { reason });
                })
                .on('uncaughtException', error => {
                    this.logger.error('Uncaught Exception thrown', { error });
                    process.exit(1);
                });
        }
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
     * Log a debug message (only in non-production environments)
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
     * @returns A new logger instance with the provided metadata
     */
    child(meta: Record<string, any>): winston.Logger {
        return this.logger.child(meta);
    }

    /**
     * Create a scoped logger with a specific context
     * @param context The context/scope name (e.g., 'Database', 'Auth')
     * @returns A new LoggerService instance scoped to the context
     */
    createScope(context: string): LoggerService {
        const scopedLogger = new LoggerService();
        (scopedLogger as any).logger = this.logger.child({ context });
        return scopedLogger;
    }
}

/**
 * Get the global logger instance
 * @returns The global logger instance
 */
export function getLogger(): LoggerService {
    return Container.get(LoggerService);
}
