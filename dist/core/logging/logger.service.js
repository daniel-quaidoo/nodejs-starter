"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
exports.getLogger = getLogger;
const winston_1 = __importDefault(require("winston"));
const typedi_1 = __importStar(require("typedi"));
/**
 * Logger service that wraps Winston for application-wide logging.
 * Provides consistent logging interface throughout the application.
 */
let LoggerService = LoggerService_1 = class LoggerService {
    constructor() {
        const { combine, timestamp, json, printf } = winston_1.default.format;
        // Custom format for development
        const devFormat = printf(({ level, message, timestamp, ...meta }) => {
            const metaString = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
            return `${timestamp} ${level}: ${message}${metaString}`;
        });
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), process.env.NODE_ENV === 'production'
                ? json()
                : winston_1.default.format.combine(winston_1.default.format.colorize(), devFormat)),
            defaultMeta: {
                service: process.env.SERVICE_NAME || 'nodejs-starter',
                environment: process.env.NODE_ENV || 'development',
            },
            transports: [
                new winston_1.default.transports.Console({
                    format: process.env.NODE_ENV === 'development'
                        ? winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
                        : winston_1.default.format.json(),
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
    info(message, meta) {
        this.logger.info(message, meta);
    }
    /**
     * Log an error message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    error(message, meta) {
        this.logger.error(message, meta);
    }
    /**
     * Log a warning message
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    warn(message, meta) {
        this.logger.warn(message, meta);
    }
    /**
     * Log a debug message (only in non-production environments)
     * @param message The message to log
     * @param meta Optional metadata to include in the log
     */
    debug(message, meta) {
        if (process.env.NODE_ENV !== 'production') {
            this.logger.debug(message, meta);
        }
    }
    /**
     * Create a child logger with additional default metadata
     * @param meta Default metadata to include in all logs from the child logger
     * @returns A new logger instance with the provided metadata
     */
    child(meta) {
        return this.logger.child(meta);
    }
    /**
     * Create a scoped logger with a specific context
     * @param context The context/scope name (e.g., 'Database', 'Auth')
     * @returns A new LoggerService instance scoped to the context
     */
    createScope(context) {
        const scopedLogger = new LoggerService_1();
        scopedLogger.logger = this.logger.child({ context });
        return scopedLogger;
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = LoggerService_1 = __decorate([
    (0, typedi_1.Service)({ global: true }),
    __metadata("design:paramtypes", [])
], LoggerService);
/**
 * Get the global logger instance
 * @returns The global logger instance
 */
function getLogger() {
    return typedi_1.default.get(LoggerService);
}
//# sourceMappingURL=logger.service.js.map