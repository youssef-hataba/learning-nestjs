var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";
let RedisService = RedisService_1 = class RedisService {
    configService;
    logger = new Logger(RedisService_1.name);
    client;
    constructor(configService) {
        this.configService = configService;
    }
    onModuleInit() {
        const host = this.configService.get("REDIS_HOST", "localhost");
        const port = Number(this.configService.get("REDIS_PORT", 6379));
        this.client = new Redis({
            host,
            port,
            maxRetriesPerRequest: 3,
        });
        this.client.on("connect", () => {
            this.logger.log(`Connected to Redis at ${host}:${port}`);
        });
        this.client.on("error", (err) => {
            this.logger.error(`Redis connection error: ${err.message}`, err.stack);
        });
    }
    async set(key, value, ttlSeconds) {
        if (ttlSeconds && ttlSeconds > 0) {
            await this.client.set(key, value, "EX", ttlSeconds);
        }
        else {
            await this.client.set(key, value);
        }
    }
    async get(key) {
        return await this.client.get(key);
    }
    async del(key) {
        await this.client.del(key);
    }
    onModuleDestroy() {
        if (this.client) {
            this.client.disconnect();
            this.logger.log("Redis client disconnected");
        }
    }
};
RedisService = RedisService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [ConfigService])
], RedisService);
export { RedisService };
//# sourceMappingURL=redis.service.js.map