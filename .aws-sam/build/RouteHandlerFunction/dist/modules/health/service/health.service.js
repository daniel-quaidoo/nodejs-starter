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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthService = void 0;
const os_1 = __importDefault(require("os"));
const uuid_1 = require("uuid");
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
let HealthService = class HealthService {
    constructor() {
        this.dataSource = typedi_1.Container.get(typeorm_1.DataSource);
        this.nodeId = process.env.NODE_ID || (0, uuid_1.v4)();
    }
    async checkDatabase() {
        const startTime = process.hrtime();
        try {
            await this.dataSource.query('SELECT 1');
            const [seconds, nanoseconds] = process.hrtime(startTime);
            const responseTime = Math.round((seconds * 1000) + (nanoseconds / 1000000));
            return { status: true, responseTime };
        }
        catch (error) {
            return {
                status: false,
                error: error instanceof Error ? error.message : 'Unknown database error'
            };
        }
    }
    getSystemInfo() {
        return {
            id: this.nodeId,
            hostname: os_1.default.hostname(),
            platform: process.platform,
            arch: process.arch,
            uptime: process.uptime(),
            memory: {
                total: os_1.default.totalmem(),
                free: os_1.default.freemem(),
                used: process.memoryUsage().heapUsed,
                rss: process.memoryUsage().rss,
            },
            load: os_1.default.loadavg(),
            cpus: os_1.default.cpus().length,
        };
    }
    async getHealthStatus() {
        const systemInfo = this.getSystemInfo();
        const databaseCheck = await this.checkDatabase();
        const allServicesHealthy = databaseCheck.status;
        const status = allServicesHealthy ? 'healthy' : 'unhealthy';
        return {
            status,
            timestamp: new Date().toISOString(),
            node: {
                id: systemInfo.id,
                hostname: systemInfo.hostname,
                platform: systemInfo.platform,
                arch: systemInfo.arch,
                uptime: systemInfo.uptime,
            },
            services: {
                database: {
                    status: databaseCheck.status ? 'connected' : 'disconnected',
                    responseTime: databaseCheck.responseTime,
                    ...(databaseCheck.error ? { error: databaseCheck.error } : {})
                },
            },
            details: {
                memory: systemInfo.memory,
                load: systemInfo.load,
                cpus: systemInfo.cpus,
            },
        };
    }
};
exports.HealthService = HealthService;
exports.HealthService = HealthService = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [])
], HealthService);
//# sourceMappingURL=health.service.js.map