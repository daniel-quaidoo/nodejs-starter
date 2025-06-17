"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var LoggerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const winston_1 = __importDefault(require("winston"));
const typedi_1 = require("typedi");
/**
 * Logger service that wraps Winston for application-wide logging.
 * Provides consistent logging interface throughout the application.
 */
let LoggerService = LoggerService_1 = class LoggerService {
    constructor() {
        const { combine, timestamp, json } = winston_1.default.format;
        this.logger = winston_1.default.createLogger({
            level: process.env.LOG_LEVEL || 'info',
            format: combine(timestamp(), json()),
            defaultMeta: {
                service: process.env.SERVICE_NAME || 'nodejs-starter',
                environment: process.env.NODE_ENV || 'development',
            },
            transports: [
                new winston_1.default.transports.Console({
                    format: process.env.NODE_ENV === 'development'
                        ? winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple())
                        : winston_1.default.format.json(),
                }),
            ],
        });
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
     * Log a debug message
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
     */
    child(meta) {
        const childLogger = new LoggerService_1();
        childLogger.logger = this.logger.child(meta);
        return childLogger;
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = LoggerService_1 = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], LoggerService);
//# sourceMappingURL=logger.service.js.map